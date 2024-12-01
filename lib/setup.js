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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = setup;
const fs = __importStar(require("fs"));
const child_process_1 = require("child_process");
const common_1 = require("./common");
const path_1 = __importDefault(require("path"));
const update_1 = require("./update");
const version = "v18.20.5";
function setup() {
    return new Promise((res, rej) => __awaiter(this, void 0, void 0, function* () {
        const folderDotN = yield setupFolderDotN();
        if (folderDotN) {
            const setting = {
                engine: "node",
                tool: "npm"
            };
            fs.writeFileSync(common_1.DIR_PATH_HOME_DOT_N_SETTING_FILE, JSON.stringify(setting, null, "\t"));
            yield (0, update_1.updateFileDotNRC)(version);
            (0, child_process_1.execFileSync)('setx', ['N_HOME', `"${common_1.DIR_PATH_HOME_DOT_N_FOLDER}"`], {
                stdio: ['pipe', 'pipe', process.stderr],
                encoding: 'utf8',
                shell: true
            });
            const pathNode = (0, child_process_1.execFileSync)('where', ['node'], {
                stdio: ['pipe', 'pipe', process.stderr],
                encoding: 'utf8',
                shell: true
            });
            const pathNodeArr = pathNode.split("\n");
            if (pathNodeArr.length > 1) {
                const pathArr = [];
                pathNodeArr.forEach((patnNode) => {
                    if (patnNode.includes('node.exe')) {
                        pathArr.push(patnNode);
                    }
                });
                if (pathArr.length > 1) {
                    let val = yield setNodeSymLink(pathArr[0]);
                    if (val) {
                        res(true);
                    }
                }
                else {
                    let val = yield setNodeSymLink(pathArr[0]);
                    if (val) {
                        res(true);
                    }
                }
                let val = yield setNodeSymLink(pathNodeArr[0]);
                if (val) {
                    res(true);
                }
            }
            else if (pathNodeArr.length === 1) {
                let val = yield setNodeSymLink(pathNodeArr[0]);
                if (val) {
                    res(true);
                }
            }
            else {
                let nv = yield (0, update_1.updateNodeVersion)(version);
                if (nv) {
                    let val = yield setNodeSymLink(`${path_1.default.join(common_1.DIR_PATH_HOME_DOT_N_VERSION_FOLDER, version)}`);
                    if (val) {
                        res(true);
                    }
                }
            }
        }
    }));
}
function setupFolderDotN() {
    return new Promise((res, rej) => __awaiter(this, void 0, void 0, function* () {
        const folders = fs.readdirSync(common_1.DIR_PATH_HOME_FOLDER);
        if (!folders.includes('.n')) {
            fs.mkdirSync(common_1.DIR_PATH_HOME_DOT_N_FOLDER, { recursive: true });
            let foldeDotNVersion = yield (0, update_1.setupFolderDotNVersion)();
            if (foldeDotNVersion) {
                res(true);
            }
        }
        else {
            let foldeDotNVersion = yield (0, update_1.setupFolderDotNVersion)();
            if (foldeDotNVersion) {
                res(true);
            }
        }
    }));
}
function setupEnv() {
    return new Promise((res, rej) => __awaiter(this, void 0, void 0, function* () {
        const sourceFolder = path_1.default.join(__dirname, '../', 'setup.cmd');
        (0, child_process_1.execFileSync)(`${sourceFolder}`, {
            stdio: ['pipe', 'pipe', process.stderr],
            encoding: 'utf8',
            shell: true
        });
        res(true);
    }));
}
function setNodeSymLink(pathNode) {
    return new Promise((res, rej) => __awaiter(this, void 0, void 0, function* () {
        const pathArr = pathNode.split("\\");
        pathArr.pop();
        const newPath = path_1.default.join(...pathArr);
        (0, child_process_1.execFileSync)('setx', ['N_SYMLINK', `"${newPath}"`], {
            stdio: ['pipe', 'pipe', process.stderr],
            encoding: 'utf8',
            shell: true
        });
        const val = yield setupEnv();
        if (val) {
            res(val);
        }
    }));
}
