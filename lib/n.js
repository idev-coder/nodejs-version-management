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
exports.n = n;
const fs = __importStar(require("fs"));
const common_1 = require("./common");
const engine_fs_1 = require("./engine-fs");
const bin_1 = require("./bin");
function pkgScripts() {
    const pkgStr = (0, engine_fs_1.readFileSystem)(common_1.DIR_PATH_PROJECT_PACKAGE_JSON_FILE);
    const pkg = JSON.parse(pkgStr);
    return pkg.scripts;
}
function n(options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var version = yield (0, engine_fs_1.readNodeVersion)();
            var strToArr;
            var stdout;
            const settingStr = fs.readFileSync(common_1.DIR_PATH_HOME_DOT_N_SETTING_FILE);
            const { engine, tool } = JSON.parse(settingStr);
            strToArr = options[0].split("");
            if (version) {
                if (strToArr[0].includes(".") || strToArr[0].includes("/")) {
                    return (0, bin_1.bin)(engine, options);
                }
                else {
                    if (options[0].includes(".mjs") || options[0].includes(".js")) {
                        return (0, bin_1.bin)(engine, options);
                    }
                    else if (options[0].includes(".mts") || options[0].includes(".ts")) {
                        if (tool === "npm") {
                            return (0, bin_1.bin)("npx", ['ts-node', options[0]]);
                        }
                    }
                    else {
                        const packageScripts = pkgScripts();
                        if (packageScripts[`${options[0]}`]) {
                            if (options[0] === "start") {
                                return (0, bin_1.bin)(tool, [options[0]]);
                            }
                            else {
                                return (0, bin_1.bin)(tool, ["run", options[0]]);
                            }
                        }
                        else {
                            if (tool === 'npm') {
                                return (0, bin_1.bin)('npx', options);
                            }
                        }
                    }
                }
            }
            else {
                return common_1.MSG_NODE_VERSION_NOT_FOULT;
            }
        }
        catch (err) {
            return `${err}`;
        }
    });
}
