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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNodeVersion = updateNodeVersion;
exports.setupFolderDotNVersion = setupFolderDotNVersion;
exports.updateEnvironmentVariables = updateEnvironmentVariables;
exports.updateFileDotNRC = updateFileDotNRC;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const download_1 = require("./download");
const common_1 = require("./common");
function updateNodeVersion(name) {
    return new Promise((res, rej) => __awaiter(this, void 0, void 0, function* () {
        const url = `${common_1.NODE_DOWNLOAD_MIRROR_URI}/release/${name}/node-${name}-${common_1.platform}-${common_1.arch}.${os.platform() === "win32" ? "zip" : "tar.xz"}`;
        const filePath = path.basename(url);
        const outputDir = path.join(common_1.DIR_PATH_HOME_DOT_N_VERSION_FOLDER, name);
        const outputDownloadDir = path.join(common_1.DIR_PATH_HOME_DOT_N_VERSION_FOLDER, filePath);
        let statusDirVersion = yield validateDirVersion(common_1.DIR_PATH_HOME_DOT_N_VERSION_FOLDER);
        if (statusDirVersion) {
            let statusOutputDir = yield validateDirVersion(outputDir);
            if (statusOutputDir) {
                updateFileDotNRC(name);
                let setup = yield updateEnvironmentVariables(name);
                if (setup) {
                    res(true);
                }
            }
            else {
                updateFileDotNRC(name);
                let download = yield (0, download_1.downloadAndUnzip)(url, outputDownloadDir, common_1.DIR_PATH_HOME_DOT_N_VERSION_FOLDER, name);
                if (download) {
                    let updatePkg = yield updateEnvironmentVariables(name);
                    if (updatePkg) {
                        res(true);
                    }
                }
            }
        }
        else {
            let status;
            status = yield updateFileDotNRC("");
            const folderDotNVersion = yield setupFolderDotNVersion();
            if (status && folderDotNVersion) {
                updateFileDotNRC(name);
                let download = yield (0, download_1.downloadAndUnzip)(url, outputDownloadDir, common_1.DIR_PATH_HOME_DOT_N_VERSION_FOLDER, name);
                if (download) {
                    let setup = yield updateEnvironmentVariables(name);
                    if (setup) {
                        // process.stdout.write('Done!\n');
                        // process.exit(0);
                        res(true);
                    }
                }
            }
        }
    }));
}
function setupFolderDotNVersion() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((res, rej) => {
            const folders = fs.readdirSync(common_1.DIR_PATH_HOME_DOT_N_FOLDER);
            if (!folders.includes('node_versions')) {
                fs.mkdirSync(common_1.DIR_PATH_HOME_DOT_N_VERSION_FOLDER, { recursive: true });
                res(true);
            }
            res(true);
        });
    });
}
function updateEnvironmentVariables(newVersion) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((res, rej) => {
            var newVersionPath = `${common_1.DIR_PATH_HOME_DOT_N_VERSION_FOLDER}\\${newVersion}`;
            let results = [];
            const files = fs.readdirSync(newVersionPath);
            files.forEach(file => {
                const filePath = path.join(newVersionPath, file);
                const stats = fs.statSync(filePath);
                if (!stats.isDirectory()) {
                    let fileName = file.split('.')[0];
                    const pathName = path.join(newVersionPath, fileName);
                    if (file.includes(".exe") || file.includes(".bat") || file.includes(".cmd") || file.includes(".ps1")) {
                        if (file.includes(".exe") || file.includes(".bat")) {
                            fs.writeFileSync(`${common_1.DIR_PATH_HOME_DOT_N_FOLDER}\\${fileName}`, `#!/bin/sh
exec "${pathName}"  "$@"`);
                            fs.writeFileSync(`${common_1.DIR_PATH_HOME_DOT_N_FOLDER}\\${fileName}.cmd`, `@ECHO off
GOTO start
:find_dp0
SET dp0=%~dp0
EXIT /b
:start
SETLOCAL
CALL :find_dp0
${pathName} %*`);
                            fs.writeFileSync(`${common_1.DIR_PATH_HOME_DOT_N_FOLDER}\\${fileName}.ps1`, `#!/usr/bin/env pwsh
& "${pathName}"  $args
exit $LASTEXITCODE`);
                            results.push(pathName);
                        }
                        else {
                            if (file.includes(".cmd")) {
                                fs.writeFileSync(`${common_1.DIR_PATH_HOME_DOT_N_FOLDER}\\${file}`, `@ECHO off
GOTO start
:find_dp0
SET dp0=%~dp0
EXIT /b
:start
SETLOCAL
CALL :find_dp0
${pathName} %*`);
                                results.push(pathName);
                            }
                            else if (file.includes(".ps1")) {
                                fs.writeFileSync(`${common_1.DIR_PATH_HOME_DOT_N_FOLDER}\\${file}`, `#!/usr/bin/env pwsh
& "${pathName}"  $args
exit $LASTEXITCODE`);
                                results.push(pathName);
                            }
                        }
                    }
                    else if (!file.includes('.')) {
                        if (!file.includes('LICENSE')) {
                            fs.writeFileSync(`${common_1.DIR_PATH_HOME_DOT_N_FOLDER}\\${file}`, `#!/bin/sh
exec "${pathName}"  "$@"`);
                            results.push(pathName);
                        }
                    }
                }
            });
            res(results);
            process.stdout.write("[✓] Update\n");
        });
    });
}
function updateFileDotNRC(fileContent) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            fs.writeFileSync(common_1.DIR_PATH_HOME_DOT_N_DOT_NRC_FILE, fileContent);
            return true;
        }
        catch (err) {
            return false;
        }
    });
}
function validateDirVersion(directoryPathName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const files = fs.readdirSync(directoryPathName, { withFileTypes: true });
            files.forEach((file) => {
                if (file.isDirectory()) {
                }
            });
            return true;
        }
        catch (err) {
            return false;
        }
    });
}
