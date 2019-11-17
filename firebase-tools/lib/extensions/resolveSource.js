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
const clc = require("cli-color");
const api = require("../api");
const error_1 = require("../error");
const EXTENSIONS_REGISTRY_ENDPOINT = "/extensions.json";
function resolveSource(extensionName) {
    return __awaiter(this, void 0, void 0, function* () {
        const [name, version] = extensionName.split("@");
        const extensionsRegistry = yield getExtensionRegistry();
        const extension = _.get(extensionsRegistry, name);
        if (!extension) {
            throw new error_1.FirebaseError(`Unable to find extension source named ${clc.bold(name)}.`);
        }
        const seekVersion = version || "latest";
        const versionFromLabel = _.get(extension, ["labels", seekVersion]);
        const source = _.get(extension, ["versions", seekVersion]) || _.get(extension, ["versions", versionFromLabel]);
        if (!source) {
            throw new error_1.FirebaseError(`Could not resolve version ${clc.bold(version)} of extension ${clc.bold(name)}.`);
        }
        return source;
    });
}
exports.resolveSource = resolveSource;
function getExtensionRegistry() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield api.request("GET", EXTENSIONS_REGISTRY_ENDPOINT, {
            origin: api.firebaseExtensionsRegistryOrigin,
        });
        return res.body.mods;
    });
}
