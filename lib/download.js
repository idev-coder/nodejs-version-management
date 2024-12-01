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
exports.downloadFile = downloadFile;
exports.extractTarXZ = extractTarXZ;
exports.downloadAndUnzip = downloadAndUnzip;
const fs = __importStar(require("fs"));
const https_1 = __importDefault(require("https"));
const progress_stream_1 = __importDefault(require("progress-stream"));
const path_1 = __importDefault(require("path"));
const common_1 = require("./common");
const child_process_1 = require("child_process");
const update_1 = require("./update");
const cli_loading_animation_1 = require("cli-loading-animation");
// ฟังก์ชันสำหรับดาวน์โหลดไฟล์พร้อมแสดงเปอร์เซ็นต์การโหลด
function downloadFile(url, outputLocationPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const { start, stop } = (0, cli_loading_animation_1.loading)('Download Node..');
        start();
        return new Promise((res, rej) => {
            const fileStream = fs.createWriteStream(outputLocationPath);
            // Create a progress stream
            const progress = (0, progress_stream_1.default)({
                length: 0, // Placeholder for total length
                time: 1000 // Update progress every second
            });
            // Handle progress events
            https_1.default.get(url, (response) => {
                // Set the length of the progress stream to the size of the file (if known)
                progress.length = parseInt(response.headers['content-length'] || '0', 10);
                response.pipe(progress).pipe(fileStream);
                fileStream.on('finish', () => {
                    fileStream.close(() => {
                        res(100);
                        stop();
                        process.stdout.write("[✓] Download NodeJS\n");
                    });
                });
            }).on('error', (err) => {
                fs.unlinkSync(outputLocationPath); // Delete the file if there's an error
                rej(err);
                stop();
            });
        });
    });
}
// ฟังก์ชันสำหรับแตกไฟล์
/**
 * Asynchronously attempts to delete a file at the given path.
 * @param filePath - The path to the file to be deleted.
 * @returns A promise that resolves to true if the file is successfully deleted, or rejects with an error.
 */
function tryDeleteFile(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fs.unlinkSync(filePath);
            return true;
        }
        catch (error) {
            throw error;
        }
    });
}
function tryRename(oldPath, newPath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fs.renameSync(oldPath, newPath);
            return true;
        }
        catch (error) {
            throw error;
        }
    });
}
function trySetup(version) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((res, rej) => {
            const sourceFolder = path_1.default.join(__dirname, '../', 'commands');
            const destinationFolder = path_1.default.join(common_1.DIR_PATH_HOME_DOT_N_VERSION_FOLDER, version);
            let results = [];
            // อ่านไฟล์ในโฟลเดอร์ต้นทาง
            const files = fs.readdirSync(sourceFolder);
            files.forEach(file => {
                const sourceFile = path_1.default.join(sourceFolder, file);
                const destFile = path_1.default.join(destinationFolder, file);
                const stats = fs.statSync(sourceFile);
                if (!stats.isDirectory()) {
                    const data = fs.readFileSync(sourceFile, 'utf8');
                    results.push(data);
                    fs.writeFileSync(destFile, data);
                }
            });
            res(results);
            process.stdout.write("[✓] Setup\n");
        });
    });
}
function tryInstall(path) {
    return __awaiter(this, void 0, void 0, function* () {
        process.stdout.write("[..] Install Package");
        return new Promise((res, rej) => {
            const npmInit = (0, child_process_1.execFileSync)('npm', ['init', '-y'], {
                cwd: path,
                stdio: 'pipe',
                encoding: 'utf8',
                shell: true
            });
            const npmInstall = (0, child_process_1.execFileSync)('npm', ['install', '-S', '@idev-coder/n', 'pnpm', 'yarn'], {
                cwd: path,
                stdio: ['pipe', 'pipe', process.stderr],
                encoding: 'utf8',
                shell: true
            });
            if (npmInit && npmInstall) {
                res(true);
                process.stdout.write("[✓] Install Package\n");
            }
        });
    });
}
function extractTarXZ(filePath, extractToPath, version) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((res, rej) => __awaiter(this, void 0, void 0, function* () {
            if (fs.existsSync(filePath)) {
                (0, child_process_1.execFileSync)(`tar`, ['-xf', filePath, '-C', extractToPath], {
                    stdio: ['pipe', 'pipe', process.stderr],
                    encoding: 'utf8',
                    shell: true
                });
                const oldPath = path_1.default.join(extractToPath, `node-${version}-${common_1.platform}-${common_1.arch}`);
                const newPath = path_1.default.join(extractToPath, `${version}`);
                const del = yield tryDeleteFile(filePath);
                if (del) {
                    let rename = yield tryRename(oldPath, newPath);
                    if (rename) {
                        process.stdout.write("[✓] Extract\n");
                        let setup = yield trySetup(version);
                        if (setup.length > 0) {
                            let updateEnv = yield (0, update_1.updateEnvironmentVariables)(version);
                            if (updateEnv.length > 0) {
                                const install = yield tryInstall(path_1.default.join(common_1.DIR_PATH_HOME_DOT_N_VERSION_FOLDER, version));
                                res(install);
                            }
                        }
                    }
                }
            }
            else {
                rej(filePath);
                console.error('ไม่พบ:', filePath);
            }
        }));
    });
}
// ดาวน์โหลดและแตกไฟล์
function downloadAndUnzip(url, filePath, outputDir, version) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield downloadFile(url, filePath);
            if (res === 100) {
                let ex = yield extractTarXZ(filePath, outputDir, version);
                if (ex) {
                    return true;
                }
            }
        }
        catch (error) {
            console.error('เกิดข้อผิดพลาด:', error);
            return error;
        }
    });
}
