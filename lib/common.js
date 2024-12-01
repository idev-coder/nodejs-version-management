"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DIR_PATH_HOME_DOT_N_SETTING_FILE = exports.DIR_PATH_HOME_DOT_N_PATH_FILE = exports.DIR_PATH_HOME_DOT_N_DOT_NRC_FILE = exports.DIR_PATH_HOME_DOT_NENO_VERSION_FOLDER = exports.DIR_PATH_HOME_DOT_BUN_VERSION_FOLDER = exports.DIR_PATH_HOME_DOT_N_VERSION_FOLDER = exports.DIR_PATH_HOME_DOT_N_FOLDER = exports.DIR_PATH_HOME_FOLDER = exports.DIR_PATH_PROJECT_PACKAGE_JSON_FILE = exports.DIR_PATH_PROJECT_DOT_NODE_VERSION_FILE = exports.DIR_PATH_PROJECT_DOT_NVMRC_FILE = exports.DIR_PATH_PROJECT_DOT_NRC_FILE = exports.DIR_PATH_PROJECT = exports.VERSION = exports.arch = exports.platform = exports.MSG_REMOVE_NODE_VERSION_FAILED = exports.MSG_REMOVE_NODE_VERSION_SUCCESS = exports.MSG_NODE_NOT_VERSION_TYPE = exports.MSG_NODE_VERSION_NOT_FOULT = exports.NODE_DOWNLOAD_MIRROR_URI = exports.NODE_MIRROR_URI = void 0;
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const pkg = __importStar(require("../package.json"));
const project_path_file_1 = require("./project-path-file");
exports.NODE_MIRROR_URI = "https://nodejs.org/dist";
exports.NODE_DOWNLOAD_MIRROR_URI = "https://nodejs.org/download";
exports.MSG_NODE_VERSION_NOT_FOULT = "node.js version not found";
exports.MSG_NODE_NOT_VERSION_TYPE = "node.js not version type";
const MSG_REMOVE_NODE_VERSION_SUCCESS = (version) => `remove node.js ${version} success`;
exports.MSG_REMOVE_NODE_VERSION_SUCCESS = MSG_REMOVE_NODE_VERSION_SUCCESS;
const MSG_REMOVE_NODE_VERSION_FAILED = (version) => `remove node.js ${version} failed`;
exports.MSG_REMOVE_NODE_VERSION_FAILED = MSG_REMOVE_NODE_VERSION_FAILED;
exports.platform = os.platform() === "win32" ? "win" : os.platform();
exports.arch = os.arch();
exports.VERSION = pkg.version;
exports.DIR_PATH_PROJECT = (0, project_path_file_1.projectPathFile)("");
exports.DIR_PATH_PROJECT_DOT_NRC_FILE = (0, project_path_file_1.projectPathFile)(".nrc");
exports.DIR_PATH_PROJECT_DOT_NVMRC_FILE = (0, project_path_file_1.projectPathFile)(".nvmrc");
exports.DIR_PATH_PROJECT_DOT_NODE_VERSION_FILE = (0, project_path_file_1.projectPathFile)(".node-version");
exports.DIR_PATH_PROJECT_PACKAGE_JSON_FILE = (0, project_path_file_1.projectPathFile)("package.json");
exports.DIR_PATH_HOME_FOLDER = os.homedir();
exports.DIR_PATH_HOME_DOT_N_FOLDER = path.join(exports.DIR_PATH_HOME_FOLDER, '.n');
exports.DIR_PATH_HOME_DOT_N_VERSION_FOLDER = path.join(exports.DIR_PATH_HOME_DOT_N_FOLDER, 'node_versions');
exports.DIR_PATH_HOME_DOT_BUN_VERSION_FOLDER = path.join(exports.DIR_PATH_HOME_DOT_N_FOLDER, 'bun_versions');
exports.DIR_PATH_HOME_DOT_NENO_VERSION_FOLDER = path.join(exports.DIR_PATH_HOME_DOT_N_FOLDER, 'neno_versions');
exports.DIR_PATH_HOME_DOT_N_DOT_NRC_FILE = path.join(exports.DIR_PATH_HOME_DOT_N_FOLDER, '.nrc');
exports.DIR_PATH_HOME_DOT_N_PATH_FILE = path.join(exports.DIR_PATH_HOME_DOT_N_FOLDER, 'path.txt');
exports.DIR_PATH_HOME_DOT_N_SETTING_FILE = path.join(exports.DIR_PATH_HOME_DOT_N_FOLDER, 'settings.json');
