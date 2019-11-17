"use strict";
const _ = require("lodash");
const clc = require("cli-color");
const opn = require("open");
const cloudbilling = require("../gcp/cloudbilling");
const { FirebaseError } = require("../error");
const logger = require("../logger");
const extensionsHelper = require("./extensionsHelper");
const prompt = require("../prompt");
const utils = require("../utils");
function _logBillingStatus(enabled, projectId) {
    return enabled
        ? utils.logLabeledSuccess(extensionsHelper.logPrefix, `${clc.bold(projectId)} has successfully been upgraded.`)
        : Promise.reject(new FirebaseError(`${extensionsHelper.logPrefix}: ${clc.bold(projectId)} could not be upgraded. Please add a billing account via the Firebase console before proceeding.`));
}
function _openBillingAccount(projectId, url, open) {
    if (open) {
        opn(url).catch((err) => {
            logger.debug("Unable to open billing URL: " + err.stack);
        });
    }
    return prompt
        .promptOnce({
        name: "continue",
        type: "confirm",
        message: "Press enter when finished upgrading your project to continue setting up your extension.",
        default: true,
    })
        .then(() => {
        return cloudbilling.checkBillingEnabled(projectId);
    });
}
function _chooseBillingAccount(projectId, extensionName, accounts) {
    const choices = _.map(accounts, "displayName");
    choices.push("Add new billing account");
    const question = {
        name: "billing",
        type: "list",
        message: `The extension ${clc.underline(extensionName)} requires your project to be upgraded to the Blaze plan. You have access to the following billing accounts.
Please select the one that you would like to associate with this project:`,
        choices: choices,
    };
    return prompt
        .promptOnce(question)
        .then((answer) => {
        if (answer === "Add new billing account") {
            const billingURL = `https://console.cloud.google.com/billing/linkedaccount?project=${projectId}`;
            return _openBillingAccount(projectId, billingURL, true);
        }
        else {
            const billingAccount = _.find(accounts, ["displayName", answer]);
            return cloudbilling.setBillingAccount(projectId, billingAccount.name);
        }
    })
        .then((enabled) => {
        return _logBillingStatus(enabled, projectId);
    });
}
function _setUpBillingAccount(projectId, extensionName) {
    const billingURL = `https://console.cloud.google.com/billing/linkedaccount?project=${projectId}`;
    logger.info();
    logger.info(`The extension ${clc.bold(extensionName)} requires your project to be upgraded to the Blaze plan. Please visit the following link to add a billing account:`);
    logger.info();
    logger.info(clc.bold.underline(billingURL));
    logger.info();
    return prompt
        .promptOnce({
        name: "open-url",
        type: "confirm",
        message: "Press enter to open the URL.",
        default: true,
    })
        .then((open) => {
        return _openBillingAccount(projectId, billingURL, open);
    })
        .then((enabled) => {
        return _logBillingStatus(enabled, projectId);
    });
}
module.exports = function (projectId, extensionName, required) {
    if (!required) {
        return Promise.resolve();
    }
    return cloudbilling
        .checkBillingEnabled(projectId)
        .then((enabled) => {
        return enabled ? Promise.reject("billing enabled") : cloudbilling.listBillingAccounts();
    })
        .then((billingAccounts) => {
        if (billingAccounts) {
            const accounts = _.filter(billingAccounts, ["open", true]);
            return accounts.length > 0
                ? _chooseBillingAccount(projectId, extensionName, accounts)
                : _setUpBillingAccount(projectId, extensionName);
        }
    })
        .catch((err) => {
        if (err === "billing enabled") {
            return;
        }
        throw err;
    });
};
