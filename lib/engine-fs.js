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
exports.readFileSystem = readFileSystem;
exports.readNodeVersion = readNodeVersion;
exports.removeNodeVersion = removeNodeVersion;
const fs = __importStar(require("fs"));
const common_1 = require("./common");
function readFileSystem(directoryPath) {
    try {
        const data = fs.readFileSync(directoryPath, 'utf8');
        return data;
    }
    catch (err) {
        return "";
    }
}
function readNodeVersion() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var version;
            var pkg;
            version = yield readFileSystem(common_1.DIR_PATH_PROJECT_DOT_NRC_FILE);
            version = yield readFileSystem(common_1.DIR_PATH_PROJECT_DOT_NVMRC_FILE);
            version = yield readFileSystem(common_1.DIR_PATH_PROJECT_DOT_NODE_VERSION_FILE);
            if (version) {
                return version;
            }
            else {
                let pkgStr = yield readFileSystem(common_1.DIR_PATH_PROJECT_PACKAGE_JSON_FILE);
                if (pkgStr) {
                    pkg = JSON.parse(pkgStr);
                    if (pkg.engines && pkg.engines.node) {
                        return pkg.engines.node;
                    }
                    else {
                        version = yield readFileSystem(common_1.DIR_PATH_HOME_DOT_N_DOT_NRC_FILE);
                        return version;
                    }
                }
                else {
                    version = yield readFileSystem(common_1.DIR_PATH_HOME_DOT_N_DOT_NRC_FILE);
                    return version;
                }
            }
        }
        catch (err) {
            return err;
        }
    });
}
function removeNodeVersion(version) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const files = fs.readdirSync(common_1.DIR_PATH_HOME_DOT_N_VERSION_FOLDER, { withFileTypes: true });
            // console.log('รายการโฟลเดอร์:');
            const versions = [];
            files.forEach((file) => {
                if (file.isDirectory()) {
                    // console.log(file.name);
                    versions.push(file.name);
                }
            });
            let groupVersions = versions.filter((val) => val.includes(version));
            // ลบโฟลเดอร์และเนื้อหาภายใน (recursive)
            fs.rmSync(`${common_1.DIR_PATH_HOME_DOT_N_VERSION_FOLDER}/${groupVersions[0]}`, { recursive: true, force: true });
            // console.log('โฟลเดอร์ถูกลบเรียบร้อยแล้ว!');
            return (0, common_1.MSG_REMOVE_NODE_VERSION_SUCCESS)(groupVersions[0]);
        }
        catch (err) {
            // console.error('เกิดข้อผิดพลาดในการลบโฟลเดอร์:', err);
            return err;
        }
    });
}
