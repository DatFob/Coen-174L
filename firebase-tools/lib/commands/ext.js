"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const clc = require("cli-color");
const Command = require("../command");
const getProjectId = require("../getProjectId");
const listExtensions_1 = require("../extensions/listExtensions");
const requirePermissions = require("../requirePermissions");
const logger = require("../logger");
module.exports = new Command("ext")
    .description("display information on how to use ext commands and extensions installed to your project")
    .before(requirePermissions, ["deploymentmanager.deployments.get"])
    .action((options) => {
    const projectId = getProjectId(options);
    const commands = [
        "ext-configure",
        "ext-info",
        "ext-install",
        "ext-list",
        "ext-uninstall",
        "ext-update",
    ];
    _.forEach(commands, (command) => {
        let cmd = require("./" + command);
        if (cmd.default) {
            cmd = cmd.default;
        }
        logger.info();
        logger.info(`${clc.bold(cmd._cmd)} - ${cmd._description}`);
        if (cmd._options.length > 0) {
            logger.info("Option(s):");
            _.forEach(cmd._options, (option) => {
                logger.info("  ", option[0], " ", option[1]);
            });
        }
        logger.info();
    });
    return listExtensions_1.listExtensions(projectId);
});
