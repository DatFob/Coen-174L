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
const Command = require("../command");
const error_1 = require("../error");
const projects_1 = require("../management/projects");
const prompt_1 = require("../prompt");
const requireAuth = require("../requireAuth");
module.exports = new Command("projects:create [projectId]")
    .description("create a new firebase project")
    .option("-n, --display-name <displayName>", "(optional) display name for the project")
    .option("-o, --organization <organizationId>", "(optional) ID of the parent Google Cloud Platform organization under which to create this project")
    .option("-f, --folder <folderId>", "(optional) ID of the parent Google Cloud Platform folder in which to create this project")
    .before(requireAuth)
    .action((projectId, options) => __awaiter(this, void 0, void 0, function* () {
    options.projectId = projectId;
    if (options.organization && options.folder) {
        throw new error_1.FirebaseError("Invalid argument, please provide only one type of project parent (organization or folder)");
    }
    if (!options.nonInteractive) {
        yield prompt_1.prompt(options, projects_1.PROJECTS_CREATE_QUESTIONS);
    }
    if (!options.projectId) {
        throw new error_1.FirebaseError("Project ID cannot be empty");
    }
    let parentResource;
    if (options.organization) {
        parentResource = { type: projects_1.ProjectParentResourceType.ORGANIZATION, id: options.organization };
    }
    else if (options.folder) {
        parentResource = { type: projects_1.ProjectParentResourceType.FOLDER, id: options.folder };
    }
    return projects_1.createFirebaseProjectAndLog(options.projectId, {
        displayName: options.displayName,
        parentResource,
    });
}));
