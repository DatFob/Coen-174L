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
const _ = require("lodash");
const path = require("path");
const express = require("express");
const request = require("request");
const clc = require("cli-color");
const http = require("http");
const getProjectId = require("../getProjectId");
const utils = require("../utils");
const logger = require("../logger");
const track = require("../track");
const constants_1 = require("./constants");
const types_1 = require("./types");
const chokidar = require("chokidar");
const spawn = require("cross-spawn");
const child_process_1 = require("child_process");
const functionsEmulatorShared_1 = require("./functionsEmulatorShared");
const registry_1 = require("./registry");
const events_1 = require("events");
const emulatorLogger_1 = require("./emulatorLogger");
const functionsRuntimeWorker_1 = require("./functionsRuntimeWorker");
const EVENT_INVOKE = "functions:invoke";
const DATABASE_PATH_PATTERN = new RegExp("^projects/[^/]+/instances/[^/]+/refs(/.*)$");
const WORKER_POOL = new functionsRuntimeWorker_1.RuntimeWorkerPool();
class FunctionsEmulator {
    constructor(options, args) {
        this.options = options;
        this.args = args;
        this.projectId = "";
        this.nodeBinary = "";
        this.functionsDir = "";
        this.triggers = [];
        this.knownTriggerIDs = {};
        this.projectId = getProjectId(this.options, false);
        this.functionsDir = path.join(this.options.config.projectDir, this.options.config.get("functions.source"));
        emulatorLogger_1.EmulatorLogger.verbosity = this.args.quiet ? emulatorLogger_1.Verbosity.QUIET : emulatorLogger_1.Verbosity.DEBUG;
    }
    static getHttpFunctionUrl(host, port, projectId, name, region) {
        return `http://${host}:${port}/${projectId}/${region}/${name}`;
    }
    static createHubServer(bundleTemplate, nodeBinary) {
        const hub = express();
        hub.use((req, res, next) => {
            const chunks = [];
            req.on("data", (chunk) => {
                chunks.push(chunk);
            });
            req.on("end", () => {
                req.rawBody = Buffer.concat(chunks);
                next();
            });
        });
        hub.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
            res.json({ status: "alive" });
        }));
        const backgroundFunctionRoute = "/functions/projects/:project_id/triggers/:trigger_name";
        const httpsFunctionRoute = `/:project_id/:region/:trigger_name`;
        const httpsFunctionRoutes = [httpsFunctionRoute, `${httpsFunctionRoute}/*`];
        const backgroundHandler = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const method = req.method;
            const triggerId = req.params.trigger_name;
            emulatorLogger_1.EmulatorLogger.log("DEBUG", `Accepted request ${method} ${req.url} --> ${triggerId}`);
            const reqBody = req.rawBody;
            const proto = JSON.parse(reqBody.toString());
            const worker = FunctionsEmulator.startFunctionRuntime(bundleTemplate, triggerId, functionsEmulatorShared_1.EmulatedTriggerType.BACKGROUND, nodeBinary, proto);
            worker.onLogs((el) => {
                if (el.level === "FATAL") {
                    res.send(el.text);
                }
            });
            emulatorLogger_1.EmulatorLogger.log("DEBUG", `[functions] Waiting for runtime to be ready!`);
            const log = yield worker.waitForSystemLog((evt) => {
                return evt.data.state === "ready";
            });
            track(EVENT_INVOKE, log.data.service);
            yield worker.waitForDone();
            return res.json({ status: "acknowledged" });
        });
        const httpsHandler = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const method = req.method;
            const triggerId = req.params.trigger_name;
            logger.debug(`Accepted request ${method} ${req.url} --> ${triggerId}`);
            const reqBody = req.rawBody;
            const worker = FunctionsEmulator.startFunctionRuntime(bundleTemplate, triggerId, functionsEmulatorShared_1.EmulatedTriggerType.HTTPS, nodeBinary);
            worker.onLogs((el) => {
                if (el.level === "FATAL") {
                    res.status(500).send(el.text);
                }
            });
            const log = yield worker.waitForSystemLog((el) => {
                return el.data.state === "ready";
            });
            worker.runtime.metadata.socketPath = log.data.socketPath;
            logger.debug(JSON.stringify(worker.runtime.metadata));
            track(EVENT_INVOKE, "https");
            emulatorLogger_1.EmulatorLogger.log("DEBUG", `[functions] Runtime ready! Sending request! ${JSON.stringify(worker.runtime.metadata)}`);
            const runtimeReq = http.request({
                method,
                path: req.url || "/",
                headers: req.headers,
                socketPath: worker.runtime.metadata.socketPath,
            }, (runtimeRes) => {
                function forwardStatusAndHeaders() {
                    res.status(runtimeRes.statusCode || 200);
                    if (!res.headersSent) {
                        Object.keys(runtimeRes.headers).forEach((key) => {
                            const val = runtimeRes.headers[key];
                            if (val) {
                                res.setHeader(key, val);
                            }
                        });
                    }
                }
                runtimeRes.on("data", (buf) => {
                    forwardStatusAndHeaders();
                    res.write(buf);
                });
                runtimeRes.on("close", () => {
                    forwardStatusAndHeaders();
                    res.end();
                });
                runtimeRes.on("end", () => {
                    forwardStatusAndHeaders();
                    res.end();
                });
            });
            runtimeReq.on("error", () => {
                res.end();
            });
            if (reqBody) {
                runtimeReq.write(reqBody);
                runtimeReq.end();
            }
            req
                .pipe(runtimeReq, { end: true })
                .on("error", () => {
                res.end();
            });
            yield worker.waitForDone();
        });
        hub.post(backgroundFunctionRoute, backgroundHandler);
        hub.all(httpsFunctionRoutes, httpsHandler);
        return hub;
    }
    static startFunctionRuntime(bundleTemplate, triggerId, triggerType, nodeBinary, proto, runtimeOpts) {
        const runtimeBundle = Object.assign({}, bundleTemplate, { ports: {
                firestore: registry_1.EmulatorRegistry.getPort(types_1.Emulators.FIRESTORE),
                database: registry_1.EmulatorRegistry.getPort(types_1.Emulators.DATABASE),
            }, proto,
            triggerId,
            triggerType });
        const worker = invokeRuntime(nodeBinary, runtimeBundle, runtimeOpts || {});
        return worker;
    }
    static handleSystemLog(systemLog) {
        switch (systemLog.type) {
            case "runtime-status":
                if (systemLog.text === "killed") {
                    emulatorLogger_1.EmulatorLogger.log("WARN", `Your function was killed because it raised an unhandled error.`);
                }
                break;
            case "googleapis-network-access":
                emulatorLogger_1.EmulatorLogger.log("WARN", `Google API requested!\n   - URL: "${systemLog.data.href}"\n   - Be careful, this may be a production service.`);
                break;
            case "unidentified-network-access":
                emulatorLogger_1.EmulatorLogger.log("WARN", `External network resource requested!\n   - URL: "${systemLog.data.href}"\n - Be careful, this may be a production service.`);
                break;
            case "functions-config-missing-value":
                emulatorLogger_1.EmulatorLogger.log("WARN", `Non-existent functions.config() value requested!\n   - Path: "${systemLog.data.valuePath}"\n   - Learn more at https://firebase.google.com/docs/functions/local-emulator`);
                break;
            case "non-default-admin-app-used":
                emulatorLogger_1.EmulatorLogger.log("WARN", `Non-default "firebase-admin" instance created!\n   ` +
                    `- This instance will *not* be mocked and will access production resources.`);
                break;
            case "missing-module":
                emulatorLogger_1.EmulatorLogger.log("WARN", `The Cloud Functions emulator requires the module "${systemLog.data.name}" to be installed as a ${systemLog.data.isDev ? "development dependency" : "dependency"}. To fix this, run "npm install ${systemLog.data.isDev ? "--save-dev" : "--save"} ${systemLog.data.name}" in your functions directory.`);
                break;
            case "uninstalled-module":
                emulatorLogger_1.EmulatorLogger.log("WARN", `The Cloud Functions emulator requires the module "${systemLog.data.name}" to be installed. This package is in your package.json, but it's not available. \
You probably need to run "npm install" in your functions directory.`);
                break;
            case "out-of-date-module":
                emulatorLogger_1.EmulatorLogger.log("WARN", `The Cloud Functions emulator requires the module "${systemLog.data.name}" to be version >${systemLog.data.minVersion}.0.0 so your version is too old. \
You can probably fix this by running "npm install ${systemLog.data.name}@latest" in your functions directory.`);
                break;
            case "missing-package-json":
                emulatorLogger_1.EmulatorLogger.log("WARN", `The Cloud Functions directory you specified does not have a "package.json" file, so we can't load it.`);
                break;
            case "function-code-resolution-failed":
                emulatorLogger_1.EmulatorLogger.log("WARN", systemLog.data.error);
                const helper = ["We were unable to load your functions code. (see above)"];
                if (systemLog.data.isPotentially.wrong_directory) {
                    helper.push(`   - There is no "package.json" file in your functions directory.`);
                }
                if (systemLog.data.isPotentially.typescript) {
                    helper.push("   - It appears your code is written in Typescript, which must be compiled before emulation.");
                }
                if (systemLog.data.isPotentially.uncompiled) {
                    helper.push(`   - You may be able to run "npm run build" in your functions directory to resolve this.`);
                }
                utils.logWarning(helper.join("\n"));
            default:
        }
    }
    static handleRuntimeLog(log, ignore = []) {
        if (ignore.indexOf(log.level) >= 0) {
            return;
        }
        switch (log.level) {
            case "SYSTEM":
                FunctionsEmulator.handleSystemLog(log);
                break;
            case "USER":
                emulatorLogger_1.EmulatorLogger.log("USER", `${clc.blackBright("> ")} ${log.text}`);
                break;
            case "DEBUG":
                if (log.data && log.data !== {}) {
                    emulatorLogger_1.EmulatorLogger.log("DEBUG", `[${log.type}] ${log.text} ${JSON.stringify(log.data)}`);
                }
                else {
                    emulatorLogger_1.EmulatorLogger.log("DEBUG", `[${log.type}] ${log.text}`);
                }
                break;
            case "INFO":
                emulatorLogger_1.EmulatorLogger.logLabeled("BULLET", "functions", log.text);
                break;
            case "WARN":
                emulatorLogger_1.EmulatorLogger.logLabeled("WARN", "functions", log.text);
                break;
            case "WARN_ONCE":
                emulatorLogger_1.EmulatorLogger.logLabeled("WARN_ONCE", "functions", log.text);
                break;
            case "FATAL":
                emulatorLogger_1.EmulatorLogger.logLabeled("WARN", "functions", log.text);
                break;
            default:
                emulatorLogger_1.EmulatorLogger.log("INFO", `${log.level}: ${log.text}`);
                break;
        }
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.nodeBinary = yield this.askInstallNodeVersion(this.functionsDir);
            const { host, port } = this.getInfo();
            this.server = FunctionsEmulator.createHubServer(this.getBaseBundle(), this.nodeBinary).listen(port, host);
        });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            emulatorLogger_1.EmulatorLogger.logLabeled("BULLET", "functions", `Watching "${this.functionsDir}" for Cloud Functions...`);
            const watcher = chokidar.watch(this.functionsDir, {
                ignored: [
                    /.+?[\\\/]node_modules[\\\/].+?/,
                    /(^|[\/\\])\../,
                    /.+\.log/,
                ],
                persistent: true,
            });
            const loadTriggers = () => __awaiter(this, void 0, void 0, function* () {
                WORKER_POOL.refresh();
                const worker = invokeRuntime(this.nodeBinary, this.getBaseBundle());
                const triggerParseEvent = yield types_1.EmulatorLog.waitForLog(worker.runtime.events, "SYSTEM", "triggers-parsed");
                const triggerDefinitions = triggerParseEvent.data
                    .triggerDefinitions;
                const toSetup = triggerDefinitions.filter((definition) => !this.knownTriggerIDs[definition.name]);
                this.triggers = triggerDefinitions;
                const triggerResults = [];
                for (const definition of toSetup) {
                    if (definition.httpsTrigger) {
                        const region = functionsEmulatorShared_1.getFunctionRegion(definition);
                        const url = FunctionsEmulator.getHttpFunctionUrl(this.getInfo().host, this.getInfo().port, this.projectId, definition.name, region);
                        triggerResults.push({
                            name: definition.name,
                            type: "http",
                            details: url,
                        });
                    }
                    else {
                        const service = functionsEmulatorShared_1.getFunctionService(definition);
                        const result = {
                            name: definition.name,
                            type: constants_1.Constants.getServiceName(service),
                        };
                        let added = false;
                        switch (service) {
                            case constants_1.Constants.SERVICE_FIRESTORE:
                                added = yield this.addFirestoreTrigger(this.projectId, definition);
                                break;
                            case constants_1.Constants.SERVICE_REALTIME_DATABASE:
                                added = yield this.addRealtimeDatabaseTrigger(this.projectId, definition);
                                break;
                            default:
                                emulatorLogger_1.EmulatorLogger.log("DEBUG", `Unsupported trigger: ${JSON.stringify(definition)}`);
                                break;
                        }
                        result.ignored = !added;
                        triggerResults.push(result);
                    }
                    this.knownTriggerIDs[definition.name] = true;
                }
                const successTriggers = triggerResults.filter((r) => !r.ignored);
                for (const result of successTriggers) {
                    const msg = result.details
                        ? `${clc.bold(result.type)} function initialized (${result.details}).`
                        : `${clc.bold(result.type)} function initialized.`;
                    emulatorLogger_1.EmulatorLogger.logLabeled("SUCCESS", `functions[${result.name}]`, msg);
                }
                const ignoreTriggers = triggerResults.filter((r) => r.ignored);
                for (const result of ignoreTriggers) {
                    const msg = `function ignored because the ${result.type} emulator does not exist or is not running.`;
                    emulatorLogger_1.EmulatorLogger.logLabeled("BULLET", `functions[${result.name}]`, msg);
                }
            });
            const debouncedLoadTriggers = _.debounce(loadTriggers, 1000);
            watcher.on("change", (filePath) => {
                emulatorLogger_1.EmulatorLogger.log("DEBUG", `File ${filePath} changed, reloading triggers`);
                return debouncedLoadTriggers();
            });
            return loadTriggers();
        });
    }
    addRealtimeDatabaseTrigger(projectId, definition) {
        const databasePort = registry_1.EmulatorRegistry.getPort(types_1.Emulators.DATABASE);
        if (!databasePort) {
            return Promise.resolve(false);
        }
        if (definition.eventTrigger === undefined) {
            emulatorLogger_1.EmulatorLogger.log("WARN", `Event trigger "${definition.name}" has undefined "eventTrigger" member`);
            return Promise.reject();
        }
        const result = DATABASE_PATH_PATTERN.exec(definition.eventTrigger.resource);
        if (result === null || result.length !== 2) {
            emulatorLogger_1.EmulatorLogger.log("WARN", `Event trigger "${definition.name}" has malformed "resource" member. ` +
                `${definition.eventTrigger.resource}`);
            return Promise.reject();
        }
        const bundle = JSON.stringify({
            name: `projects/${projectId}/locations/_/functions/${definition.name}`,
            path: result[1],
            event: definition.eventTrigger.eventType,
            topic: `projects/${projectId}/topics/${definition.name}`,
        });
        logger.debug(`addDatabaseTrigger`, JSON.stringify(bundle));
        return new Promise((resolve, reject) => {
            let setTriggersPath = `http://localhost:${databasePort}/.settings/functionTriggers.json`;
            if (projectId !== "") {
                setTriggersPath += `?ns=${projectId}`;
            }
            else {
                emulatorLogger_1.EmulatorLogger.log("WARN", `No project in use. Registering function trigger for sentinel namespace '${constants_1.Constants.DEFAULT_DATABASE_EMULATOR_NAMESPACE}'`);
            }
            request.post(setTriggersPath, {
                auth: {
                    bearer: "owner",
                },
                body: bundle,
            }, (err, res, body) => {
                if (err) {
                    emulatorLogger_1.EmulatorLogger.log("WARN", "Error adding trigger: " + err);
                    reject();
                    return;
                }
                resolve(true);
            });
        });
    }
    addFirestoreTrigger(projectId, definition) {
        const firestorePort = registry_1.EmulatorRegistry.getPort(types_1.Emulators.FIRESTORE);
        if (!firestorePort) {
            return Promise.resolve(false);
        }
        const bundle = JSON.stringify({ eventTrigger: definition.eventTrigger });
        logger.debug(`addFirestoreTrigger`, JSON.stringify(bundle));
        return new Promise((resolve, reject) => {
            request.put(`http://localhost:${firestorePort}/emulator/v1/projects/${projectId}/triggers/${definition.name}`, {
                body: bundle,
            }, (err, res, body) => {
                if (err) {
                    emulatorLogger_1.EmulatorLogger.log("WARN", "Error adding trigger: " + err);
                    reject();
                    return;
                }
                resolve(true);
            });
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            WORKER_POOL.exit();
            Promise.resolve(this.server && this.server.close());
        });
    }
    getInfo() {
        const host = this.args.host || constants_1.Constants.getDefaultHost(types_1.Emulators.FUNCTIONS);
        const port = this.args.port || constants_1.Constants.getDefaultPort(types_1.Emulators.FUNCTIONS);
        return {
            host,
            port,
        };
    }
    getName() {
        return types_1.Emulators.FUNCTIONS;
    }
    getTriggers() {
        return this.triggers;
    }
    getBaseBundle() {
        return {
            cwd: this.functionsDir,
            projectId: this.projectId,
            triggerId: "",
            triggerType: undefined,
            ports: {
                firestore: registry_1.EmulatorRegistry.getPort(types_1.Emulators.FIRESTORE),
                database: registry_1.EmulatorRegistry.getPort(types_1.Emulators.DATABASE),
            },
            disabled_features: this.args.disabledRuntimeFeatures,
        };
    }
    askInstallNodeVersion(cwd) {
        return __awaiter(this, void 0, void 0, function* () {
            const pkg = require(path.join(cwd, "package.json"));
            if (!pkg.engines || !pkg.engines.node) {
                emulatorLogger_1.EmulatorLogger.log("WARN", "Your functions directory does not specify a Node version.\n   " +
                    "- Learn more at https://firebase.google.com/docs/functions/manage-functions#set_runtime_options");
                return process.execPath;
            }
            const hostMajorVersion = process.versions.node.split(".")[0];
            const requestedMajorVersion = pkg.engines.node;
            let localMajorVersion = "0";
            const localNodePath = path.join(cwd, "node_modules/.bin/node");
            try {
                const localNodeOutput = child_process_1.spawnSync(localNodePath, ["--version"]).stdout.toString();
                localMajorVersion = localNodeOutput.slice(1).split(".")[0];
            }
            catch (err) {
            }
            if (requestedMajorVersion === hostMajorVersion) {
                emulatorLogger_1.EmulatorLogger.logLabeled("SUCCESS", "functions", `Using node@${requestedMajorVersion} from host.`);
                return process.execPath;
            }
            if (localMajorVersion === requestedMajorVersion) {
                emulatorLogger_1.EmulatorLogger.logLabeled("SUCCESS", "functions", `Using node@${requestedMajorVersion} from local cache.`);
                return localNodePath;
            }
            emulatorLogger_1.EmulatorLogger.log("WARN", `Your requested "node" version "${requestedMajorVersion}" doesn't match your global version "${hostMajorVersion}"`);
            return process.execPath;
        });
    }
}
exports.FunctionsEmulator = FunctionsEmulator;
function invokeRuntime(nodeBinary, frb, opts) {
    opts = opts || {};
    const idleWorker = WORKER_POOL.getIdleWorker(frb.triggerId);
    if (idleWorker) {
        idleWorker.execute(frb, opts.serializedTriggers);
        return idleWorker;
    }
    const emitter = new events_1.EventEmitter();
    const metadata = {};
    const args = [path.join(__dirname, "functionsEmulatorRuntime")];
    if (opts.ignore_warnings) {
        args.unshift("--no-warnings");
    }
    const childProcess = spawn(nodeBinary, args, {
        env: Object.assign({ node: nodeBinary }, opts.env, process.env),
        cwd: frb.cwd,
        stdio: ["pipe", "pipe", "pipe", "ipc"],
    });
    const buffers = {
        stderr: { pipe: childProcess.stderr, value: "" },
        stdout: { pipe: childProcess.stdout, value: "" },
    };
    const ipcBuffer = { value: "" };
    childProcess.on("message", (message) => {
        onData(childProcess, emitter, ipcBuffer, message);
    });
    for (const id in buffers) {
        if (buffers.hasOwnProperty(id)) {
            const buffer = buffers[id];
            buffer.pipe.on("data", (buf) => {
                onData(childProcess, emitter, buffer, buf);
            });
        }
    }
    const runtime = {
        exit: new Promise((resolve) => {
            childProcess.on("exit", resolve);
        }),
        metadata,
        events: emitter,
        shutdown: () => {
            childProcess.kill();
        },
        kill: (signal) => {
            childProcess.kill(signal);
            emitter.emit("log", new types_1.EmulatorLog("SYSTEM", "runtime-status", "killed"));
        },
        send: (args) => {
            return childProcess.send(JSON.stringify(args));
        },
    };
    const worker = WORKER_POOL.addWorker(frb.triggerId, runtime);
    worker.onLogs((log) => {
        FunctionsEmulator.handleRuntimeLog(log);
    }, true);
    worker.execute(frb, opts.serializedTriggers);
    return worker;
}
exports.invokeRuntime = invokeRuntime;
function onData(runtime, emitter, buffer, buf) {
    buffer.value += buf.toString();
    const lines = buffer.value.split("\n");
    if (lines.length > 1) {
        lines.slice(0, -1).forEach((line) => {
            const log = types_1.EmulatorLog.fromJSON(line);
            emitter.emit("log", log);
            if (log.level === "FATAL") {
                emitter.emit("log", new types_1.EmulatorLog("SYSTEM", "runtime-status", "killed"));
                runtime.kill();
            }
        });
    }
    buffer.value = lines[lines.length - 1];
}
