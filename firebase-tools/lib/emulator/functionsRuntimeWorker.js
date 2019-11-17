"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid");
const types_1 = require("./types");
const events_1 = require("events");
const emulatorLogger_1 = require("./emulatorLogger");
var RuntimeWorkerState;
(function (RuntimeWorkerState) {
    RuntimeWorkerState["IDLE"] = "IDLE";
    RuntimeWorkerState["BUSY"] = "BUSY";
    RuntimeWorkerState["FINISHING"] = "FINISHING";
    RuntimeWorkerState["FINISHED"] = "FINISHED";
})(RuntimeWorkerState = exports.RuntimeWorkerState || (exports.RuntimeWorkerState = {}));
class RuntimeWorker {
    constructor(triggerId, runtime) {
        this.stateEvents = new events_1.EventEmitter();
        this.logListeners = [];
        this._state = RuntimeWorkerState.IDLE;
        this.id = uuid.v4();
        this.triggerId = triggerId;
        this.runtime = runtime;
        this.runtime.events.on("log", (log) => {
            if (log.type === "runtime-status") {
                if (log.data.state === "idle") {
                    if (this.state === RuntimeWorkerState.BUSY) {
                        this.state = RuntimeWorkerState.IDLE;
                    }
                    else if (this.state === RuntimeWorkerState.FINISHING) {
                        this.log(`IDLE --> FINISHING`);
                        this.runtime.shutdown();
                    }
                }
            }
        });
        this.runtime.exit.then(() => {
            this.log("exited");
            this.state = RuntimeWorkerState.FINISHED;
        });
    }
    execute(frb, serializedTriggers) {
        return __awaiter(this, void 0, void 0, function* () {
            this.state = RuntimeWorkerState.BUSY;
            const args = { frb, serializedTriggers };
            this.runtime.send(args);
        });
    }
    get state() {
        return this._state;
    }
    set state(state) {
        if (state === RuntimeWorkerState.IDLE) {
            for (const l of this.logListeners) {
                this.runtime.events.removeListener("log", l);
            }
            this.logListeners = [];
        }
        if (state === RuntimeWorkerState.FINISHED) {
            this.runtime.events.removeAllListeners();
        }
        this.log(state);
        this._state = state;
        this.stateEvents.emit(this._state);
    }
    onLogs(listener, forever = false) {
        if (!forever) {
            this.logListeners.push(listener);
        }
        this.runtime.events.on("log", listener);
    }
    waitForDone() {
        if (this.state === RuntimeWorkerState.IDLE || this.state === RuntimeWorkerState.FINISHED) {
            return Promise.resolve();
        }
        return new Promise((res) => {
            const listener = () => {
                this.stateEvents.removeListener(RuntimeWorkerState.IDLE, listener);
                this.stateEvents.removeListener(RuntimeWorkerState.FINISHED, listener);
                res();
            };
            this.stateEvents.once(RuntimeWorkerState.IDLE, listener);
            this.stateEvents.once(RuntimeWorkerState.FINISHED, listener);
        });
    }
    waitForSystemLog(filter) {
        return types_1.EmulatorLog.waitForLog(this.runtime.events, "SYSTEM", "runtime-status", filter);
    }
    log(msg) {
        emulatorLogger_1.EmulatorLogger.log("DEBUG", `[worker-${this.triggerId}-${this.id}]: ${msg}`);
    }
}
exports.RuntimeWorker = RuntimeWorker;
class RuntimeWorkerPool {
    constructor() {
        this.workers = new Map();
    }
    refresh() {
        for (const arr of this.workers.values()) {
            arr.forEach((w) => {
                if (w.state === RuntimeWorkerState.IDLE) {
                    this.log(`Shutting down IDLE worker (${w.triggerId})`);
                    w.runtime.shutdown();
                }
                else if (w.state === RuntimeWorkerState.BUSY) {
                    this.log(`Marking BUSY worker to finish (${w.triggerId})`);
                    w.state = RuntimeWorkerState.FINISHING;
                }
            });
        }
    }
    exit() {
        for (const arr of this.workers.values()) {
            arr.forEach((w) => {
                if (w.state === RuntimeWorkerState.IDLE) {
                    w.runtime.shutdown();
                }
                else {
                    w.runtime.kill();
                }
            });
        }
    }
    getIdleWorker(triggerId) {
        this.cleanUpWorkers();
        const key = this.getTriggerKey(triggerId);
        const keyWorkers = this.workers.get(key);
        if (!keyWorkers) {
            this.workers.set(key, []);
            return;
        }
        for (const worker of keyWorkers) {
            if (worker.state === RuntimeWorkerState.IDLE) {
                return worker;
            }
        }
        return;
    }
    addWorker(triggerId, runtime) {
        const key = this.getTriggerKey(triggerId);
        const worker = new RuntimeWorker(key, runtime);
        const keyWorkers = this.workers.get(key) || [];
        keyWorkers.push(worker);
        this.workers.set(key, keyWorkers);
        return worker;
    }
    getTriggerKey(triggerId) {
        return triggerId || "~diagnostic~";
    }
    cleanUpWorkers() {
        for (const [key, keyWorkers] of this.workers.entries()) {
            const notDoneWorkers = keyWorkers.filter((worker) => {
                return worker.state !== RuntimeWorkerState.FINISHED;
            });
            this.workers.set(key, notDoneWorkers);
        }
    }
    log(msg) {
        emulatorLogger_1.EmulatorLogger.log("DEBUG", `[worker-pool]: ${msg}`);
    }
}
exports.RuntimeWorkerPool = RuntimeWorkerPool;
