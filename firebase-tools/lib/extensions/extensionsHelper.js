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
const functionsConfig_1 = require("../functionsConfig");
const error_1 = require("../error");
const askUserForParam_1 = require("./askUserForParam");
const ensureApiEnabled_1 = require("../ensureApiEnabled");
const getProjectId = require("../getProjectId");
const generateInstanceId_1 = require("./generateInstanceId");
const prompt_1 = require("../prompt");
const logger = require("../logger");
exports.logPrefix = "extensions";
function getDBInstanceFromURL(databaseUrl = "") {
    const instanceRegex = new RegExp("(?:https://)(.*)(?:.firebaseio.com)");
    const matches = databaseUrl.match(instanceRegex);
    if (matches && matches.length > 1) {
        return matches[1];
    }
    return "";
}
exports.getDBInstanceFromURL = getDBInstanceFromURL;
function getFirebaseProjectParams(projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = yield functionsConfig_1.getFirebaseConfig({ project: projectId });
        const FIREBASE_CONFIG = JSON.stringify({
            projectId: body.projectId,
            databaseURL: body.databaseURL,
            storageBucket: body.storageBucket,
        });
        return {
            PROJECT_ID: body.projectId,
            DATABASE_URL: body.databaseURL,
            STORAGE_BUCKET: body.storageBucket,
            FIREBASE_CONFIG,
            DATABASE_INSTANCE: getDBInstanceFromURL(body.databaseURL),
        };
    });
}
exports.getFirebaseProjectParams = getFirebaseProjectParams;
function substituteParams(original, params) {
    const startingString = JSON.stringify(original);
    const reduceFunction = (intermediateResult, paramVal, paramKey) => {
        const regex = new RegExp("\\$\\{" + paramKey + "\\}", "g");
        return intermediateResult.replace(regex, paramVal);
    };
    return JSON.parse(_.reduce(params, reduceFunction, startingString));
}
exports.substituteParams = substituteParams;
function populateDefaultParams(paramVars, paramSpec) {
    const newParams = paramVars;
    _.forEach(paramSpec, (env) => {
        if (!paramVars[env.param]) {
            if (env.default) {
                newParams[env.param] = env.default;
            }
            else {
                throw new error_1.FirebaseError(`${env.param} has not been set in the given params file` +
                    " and there is no default available. Please set this variable before installing again.");
            }
        }
    });
    return newParams;
}
exports.populateDefaultParams = populateDefaultParams;
function validateCommandLineParams(envVars, paramSpec) {
    if (_.size(envVars) < _.size(paramSpec)) {
        throw new error_1.FirebaseError("A param is missing from the passed in .env file." +
            "Please check to see that all variables are set before installing again.");
    }
    if (_.size(envVars) > _.size(paramSpec)) {
        const paramList = _.map(paramSpec, (param) => {
            return param.param;
        });
        const misnamedParams = Object.keys(envVars).filter((key) => {
            return paramList.indexOf(key) === -1;
        });
        logger.info("Warning: The following params were specified in your env file but do not exist in the extension spec: " +
            `${misnamedParams.join(", ")}.`);
    }
    _.forEach(paramSpec, (param) => {
        if (!askUserForParam_1.checkResponse(envVars[param.param], param)) {
            throw new error_1.FirebaseError(`${param.param} is not valid for the reason listed above. Please set a valid value` +
                " before installing again.");
        }
    });
}
exports.validateCommandLineParams = validateCommandLineParams;
function getValidInstanceId(projectId, extensionName) {
    return __awaiter(this, void 0, void 0, function* () {
        let instanceId = yield generateInstanceId_1.generateInstanceId(projectId, extensionName);
        if (instanceId !== extensionName) {
            logger.info(`An extension named ${extensionName} already exists in project ${projectId}.`);
            instanceId = yield promptForValidInstanceId(instanceId);
        }
        return instanceId;
    });
}
exports.getValidInstanceId = getValidInstanceId;
function promptForValidInstanceId(instanceId) {
    return __awaiter(this, void 0, void 0, function* () {
        let instanceIdIsValid = false;
        let newInstanceId;
        const instanceIdRegex = /^[a-z][a-z\d\-]*[a-z\d]$/;
        while (!instanceIdIsValid) {
            newInstanceId = yield prompt_1.promptOnce({
                type: "input",
                default: instanceId,
                message: `Please enter a new name for this instance:`,
            });
            if (newInstanceId.length <= 6 || 45 <= newInstanceId.length) {
                logger.info("Invalid instance ID. Instance ID must be between 6 and 45 characters.");
            }
            else if (!instanceIdRegex.test(newInstanceId)) {
                logger.info("Invalid instance ID. Instance ID must start with a lowercase letter, " +
                    "end with a lowercase letter or number, and only contain lowercase letters, numbers, or -");
            }
            else {
                instanceIdIsValid = true;
            }
        }
        return newInstanceId;
    });
}
exports.promptForValidInstanceId = promptForValidInstanceId;
function ensureExtensionsApiEnabled(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const projectId = getProjectId(options);
        return yield ensureApiEnabled_1.ensure(projectId, "firebaseextensions.googleapis.com", "extensions", options.markdown);
    });
}
exports.ensureExtensionsApiEnabled = ensureExtensionsApiEnabled;
