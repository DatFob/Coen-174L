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
const api = require("../api");
const utils = require("../utils");
const error_1 = require("../error");
const pkg = require("../../package.json");
class AppDistributionClient {
    constructor(appId) {
        this.appId = appId;
    }
    getApp() {
        return __awaiter(this, void 0, void 0, function* () {
            utils.logBullet("getting app details...");
            const apiResponse = yield api.request("GET", `/v1alpha/apps/${this.appId}`, {
                origin: api.appDistributionOrigin,
                auth: true,
            });
            return _.get(apiResponse, "body");
        });
    }
    getJwtToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const apiResponse = yield api.request("GET", `/v1alpha/apps/${this.appId}/jwt`, {
                auth: true,
                origin: api.appDistributionOrigin,
            });
            return _.get(apiResponse, "body.token");
        });
    }
    uploadDistribution(token, distribution) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiResponse = yield api.request("POST", "/spi/v1/jwt_distributions", {
                origin: api.appDistributionUploadOrigin,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-APP-DISTRO-API-CLIENT-ID": pkg.name,
                    "X-APP-DISTRO-API-CLIENT-TYPE": distribution.platform(),
                    "X-APP-DISTRO-API-CLIENT-VERSION": pkg.version,
                },
                files: {
                    file: {
                        stream: distribution.readStream(),
                        size: distribution.fileSize(),
                        contentType: "multipart/form-data",
                    },
                },
            });
            return _.get(apiResponse, "response.headers.etag");
        });
    }
    pollReleaseIdByHash(hash, retryCount = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getReleaseIdByHash(hash);
            }
            catch (err) {
                if (retryCount >= AppDistributionClient.MAX_POLLING_RETRIES) {
                    throw new error_1.FirebaseError(`failed to find the uploaded release: ${err.message}`, { exit: 1 });
                }
                yield new Promise((resolve) => setTimeout(resolve, AppDistributionClient.POLLING_INTERVAL_MS));
                return this.pollReleaseIdByHash(hash, retryCount + 1);
            }
        });
    }
    getReleaseIdByHash(hash) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiResponse = yield api.request("GET", `/v1alpha/apps/${this.appId}/release_by_hash/${hash}`, {
                origin: api.appDistributionOrigin,
                auth: true,
            });
            return _.get(apiResponse, "body.release.id");
        });
    }
    addReleaseNotes(releaseId, releaseNotes) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!releaseNotes) {
                utils.logWarning("no release notes specified, skipping");
                return;
            }
            utils.logBullet("adding release notes...");
            const data = {
                releaseNotes: {
                    releaseNotes,
                },
            };
            try {
                yield api.request("POST", `/v1alpha/apps/${this.appId}/releases/${releaseId}/notes`, {
                    origin: api.appDistributionOrigin,
                    auth: true,
                    data,
                });
            }
            catch (err) {
                throw new error_1.FirebaseError(`failed to add release notes with ${err.message}`, { exit: 1 });
            }
            utils.logSuccess("added release notes successfully");
        });
    }
    enableAccess(releaseId, emails = [], groupIds = []) {
        return __awaiter(this, void 0, void 0, function* () {
            if (emails.length === 0 && groupIds.length === 0) {
                utils.logWarning("no testers or groups specified, skipping");
                return;
            }
            utils.logBullet("adding testers/groups...");
            const data = {
                emails,
                groupIds,
            };
            try {
                yield api.request("POST", `/v1alpha/apps/${this.appId}/releases/${releaseId}/enable_access`, {
                    origin: api.appDistributionOrigin,
                    auth: true,
                    data,
                });
            }
            catch (err) {
                let errorMessage = err.message;
                if (_.has(err, "context.body.error")) {
                    const errorStatus = _.get(err, "context.body.error.status");
                    if (errorStatus === "FAILED_PRECONDITION") {
                        errorMessage = "invalid testers";
                    }
                    else if (errorStatus === "INVALID_ARGUMENT") {
                        errorMessage = "invalid groups";
                    }
                }
                throw new error_1.FirebaseError(`failed to add testers/groups: ${errorMessage}`, { exit: 1 });
            }
            utils.logSuccess("added testers/groups successfully");
        });
    }
}
AppDistributionClient.MAX_POLLING_RETRIES = 15;
AppDistributionClient.POLLING_INTERVAL_MS = 1000;
exports.AppDistributionClient = AppDistributionClient;
