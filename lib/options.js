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
exports.options = options;
const fs = __importStar(require("fs"));
const common_1 = require("./common");
const engine_fs_1 = require("./engine-fs");
const help_1 = require("./help");
const n_1 = require("./n");
const node_version_1 = require("./node-version");
const bin_1 = require("./bin");
const update_1 = require("./update");
const setup_1 = require("./setup");
const set_tool_1 = require("./set-tool");
function options(key) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const opts = process.argv.slice(3);
            const tool = 'npm';
            if (["v", "version", "-v", "-V", "-version", "--version"].includes(key)) {
                return `v${common_1.VERSION}`;
            }
            else if (["h", "help", "-h", "-H", "--help"].includes(key)) {
                return (0, help_1.help)();
            }
            else if (["i", "install", "use", "add"].includes(key)) {
                let optionName = 'install';
                if (opts[0]) {
                    let option = yield (0, node_version_1.nodeOnlineVersion)(opts[0]);
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
                        return (0, bin_1.bin)(tool, [optionName, ...opts]);
                    }
                }
                else {
                    return (0, bin_1.bin)(tool, [optionName]);
                }
            }
            else if (['access', 'adduser', 'audit', 'bugs', 'cache', 'ci', 'completion',
                'config', 'dedupe', 'deprecate', 'diff', 'dt', 'dist-tag', 'docs', 'doctor',
                'edit', 'exec', 'explain', 'explore', 'fd', 'find-dupes', 'fund', 'get',
                'hs', 'help-search', 'hook', 'init', 'ict', 'install-ci-test', 'it',
                'install-test', 'link', 'll', 'login', 'logout', 'org', 'outdated',
                'owner', 'pack', 'ping', 'pkg', 'prefix', 'profile', 'prune', 'publish',
                'query', 'rebuild', 'repo', 'restart', 'root', 'rs', 'run-script', 'sbom',
                'search', 'set', 'shrinkwrap', 'star', 'stars', 'stop', 'team',
                'token', 'unpublish', 'unstar', 'u', 'update',
                'view', 'whoami'].includes(key)) {
                if (['u', 'update'].includes(key)) {
                    let optionName = 'update';
                    if (opts.length > 0) {
                        return (0, bin_1.bin)(tool, [optionName, ...opts]);
                    }
                    else {
                        return (0, bin_1.bin)(tool, [optionName]);
                    }
                }
                else if (['ict', 'install-ci-test'].includes(key)) {
                    let optionName = 'install-ci-test';
                    if (opts.length > 0) {
                        return (0, bin_1.bin)(tool, [optionName, ...opts]);
                    }
                    else {
                        return (0, bin_1.bin)(tool, [optionName]);
                    }
                }
                else if (['it', 'install-test'].includes(key)) {
                    let optionName = 'install-test';
                    if (opts.length > 0) {
                        return (0, bin_1.bin)(tool, [optionName, ...opts]);
                    }
                    else {
                        return (0, bin_1.bin)(tool, [optionName]);
                    }
                }
                else if (['hs', 'help-search'].includes(key)) {
                    let optionName = 'help-search';
                    if (opts.length > 0) {
                        return (0, bin_1.bin)(tool, [optionName, ...opts]);
                    }
                    else {
                        return (0, bin_1.bin)(tool, [optionName]);
                    }
                }
                else if (['rs', 'run-script'].includes(key)) {
                    let optionName = 'run-script';
                    if (opts.length > 0) {
                        return (0, bin_1.bin)(tool, [optionName, ...opts]);
                    }
                    else {
                        return (0, bin_1.bin)(tool, [optionName]);
                    }
                }
                else if (['dt', 'dist-tag'].includes(key)) {
                    let optionName = 'dist-tag';
                    if (opts.length > 0) {
                        return (0, bin_1.bin)(tool, [optionName, ...opts]);
                    }
                    else {
                        return (0, bin_1.bin)(tool, [optionName]);
                    }
                }
                else if (['fd', 'find-dupes'].includes(key)) {
                    let optionName = 'find-dupes';
                    if (opts.length > 0) {
                        return (0, bin_1.bin)(tool, [optionName, ...opts]);
                    }
                    else {
                        return (0, bin_1.bin)(tool, [optionName]);
                    }
                }
                else {
                    return (0, bin_1.bin)(tool, process.argv.slice(2));
                }
            }
            else if (["un", "rm", "del", "uninstall", "remove", "delete"].includes(key)) {
                let optionName = 'uninstall';
                if (opts[0]) {
                    let option = yield (0, node_version_1.nodeOnlineVersion)(opts[0]);
                    if (option.data.length === 1) {
                        return (0, engine_fs_1.removeNodeVersion)(opts[0]);
                    }
                    else {
                        return (0, bin_1.bin)(tool, [optionName, ...opts]);
                    }
                }
                else {
                    return common_1.MSG_NODE_VERSION_NOT_FOULT;
                }
            }
            else if (["ls", "list"].includes(key)) {
                if (opts[0]) {
                    return (0, node_version_1.nodeLocalVersion)(opts[0]);
                }
                else {
                    return (0, node_version_1.nodeLocalVersion)();
                }
            }
            else if (["lsr", "list-remote"].includes(key)) {
                if (opts[0]) {
                    let nodeVersions = yield (0, node_version_1.nodeOnlineVersion)(opts[0]);
                    return nodeVersions.message;
                }
                else {
                    let nodeVersions = yield (0, node_version_1.nodeOnlineVersion)();
                    return nodeVersions.message;
                }
            }
            else if (key === "run") {
                return (0, n_1.n)(opts);
            }
            else if (key === "setup") {
                let val = yield (0, setup_1.setup)();
                if (val) {
                    return `[✓] Setup\n`;
                }
            }
            else if (['set-tool=npm', 'set-tool=yarn', 'set-tool=pnpm'].includes(key)) {
                let val = yield (0, set_tool_1.setTool)(key);
                if (val) {
                    return `[✓] Tool\n`;
                }
            }
            else {
                return (0, bin_1.bin)(key, [...opts]);
            }
        }
        catch (err) {
            return `${err}`;
        }
    });
}
