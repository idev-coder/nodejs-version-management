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
exports.commands = commands;
const fs = __importStar(require("fs"));
const common_1 = require("./common");
const update_1 = require("./update");
const node_version_1 = require("./node-version");
const options_1 = require("./options");
const n_1 = require("./n");
const setup_1 = require("./setup");
function commands(keys) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var option = yield (0, node_version_1.nodeOnlineVersion)(keys[0]);
            if (keys[0]) {
                if (option.data.length > 0) {
                    if (option.data.length === 1) {
                        if (yield (0, update_1.updateNodeVersion)(option.message)) {
                            let settingStr = fs.readFileSync(common_1.DIR_PATH_HOME_DOT_N_SETTING_FILE);
                            let nrcStr = fs.readFileSync(common_1.DIR_PATH_HOME_DOT_N_DOT_NRC_FILE);
                            let { engine } = JSON.parse(settingStr);
                            process.stdout.write(`[✓] ${engine} > ${nrcStr}\n`);
                            process.exit(0);
                        }
                    }
                    else {
                        console.log(option.message);
                        process.exit(0);
                    }
                }
                else if (option.message === common_1.MSG_NODE_VERSION_NOT_FOULT) {
                    console.log(option.message);
                }
                else if (option.message === common_1.MSG_NODE_NOT_VERSION_TYPE) {
                    let option = yield (0, options_1.options)(keys[0]);
                    if (option) {
                        console.log(option);
                        process.exit(0);
                    }
                    else {
                        let nStr = yield (0, n_1.n)(keys);
                        console.log(nStr);
                        process.exit(0);
                    }
                }
            }
            else {
                const folders = fs.readdirSync(common_1.DIR_PATH_HOME_FOLDER);
                if (!folders.includes('.n')) {
                    let val = yield (0, setup_1.setup)();
                    if (val) {
                        let settingStr = fs.readFileSync(common_1.DIR_PATH_HOME_DOT_N_SETTING_FILE);
                        let { engine, tool } = JSON.parse(settingStr);
                        process.stdout.write(`[✓] Setup\n`);
                        process.stdout.write(`Engine: ${engine}\n`);
                        process.stdout.write(`Tool: ${tool}\n`);
                        process.exit(0);
                    }
                }
                else {
                    let settingStr = fs.readFileSync(common_1.DIR_PATH_HOME_DOT_N_SETTING_FILE);
                    let { engine, tool } = JSON.parse(settingStr);
                    process.stdout.write(`Engine: ${engine}\n`);
                    process.stdout.write(`Tool: ${tool}\n`);
                    process.exit(0);
                }
            }
        }
        catch (err) {
            console.log(`${err}`);
            process.exit(0);
        }
    });
}
