"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url = require("url");
const DEFAULT_PORTS = {
    hosting: 5000,
    functions: 5001,
    firestore: 8080,
    database: 9000,
};
const DEFAULT_HOST = "localhost";
class Constants {
    static getServiceName(service) {
        switch (service) {
            case this.SERVICE_FIRESTORE:
                return "firestore";
            case this.SERVICE_REALTIME_DATABASE:
                return "database";
            default:
                return service;
        }
    }
    static getDefaultHost(emulator) {
        return DEFAULT_HOST;
    }
    static getDefaultPort(emulator) {
        return DEFAULT_PORTS[emulator];
    }
    static getHostKey(emulator) {
        return `emulators.${emulator.toString()}.host`;
    }
    static getPortKey(emulator) {
        return `emulators.${emulator.toString()}.port`;
    }
    static getAddress(emulator, options) {
        const hostVal = options.config.get(this.getHostKey(emulator), DEFAULT_HOST);
        const portVal = options.config.get(this.getPortKey(emulator), this.getDefaultPort(emulator));
        const host = this.normalizeHost(hostVal);
        const port = parseInt(portVal, 10);
        return { host, port };
    }
    static normalizeHost(host) {
        let normalized = host;
        if (!normalized.startsWith("http")) {
            normalized = `http://${normalized}`;
        }
        const u = url.parse(normalized);
        return u.hostname || DEFAULT_HOST;
    }
}
Constants.DEFAULT_DATABASE_EMULATOR_NAMESPACE = "fake-server";
Constants.SERVICE_FIRESTORE = "firestore.googleapis.com";
Constants.SERVICE_REALTIME_DATABASE = "firebaseio.com";
exports.Constants = Constants;
