import * as fs from 'fs'
import { DIR_PATH_HOME_DOT_N_DOT_NRC_FILE, DIR_PATH_HOME_DOT_N_SETTING_FILE, MSG_NODE_VERSION_NOT_FOULT, VERSION } from "./common";
import { removeNodeVersion } from "./engine-fs";
import { help } from "./help";
import { n } from "./n";
import { nodeLocalVersion, nodeOnlineVersion } from "./node-version";
import { bin } from './bin'
import { updateNodeVersion } from "./update";
import { setup } from "./setup";
import { setTool } from "./set-tool";

export async function options(key: string) {
    try {
        const opts = process.argv.slice(3)
        let settingStr: any = fs.readFileSync(DIR_PATH_HOME_DOT_N_SETTING_FILE)
        let { engine, tool } = JSON.parse(settingStr)

        if (["v", "version", "-v", "-V", "-version", "--version"].includes(key)) {
            return `v${VERSION}`
        } else if (["h", "help", "-h", "-H", "--help"].includes(key)) {
            return help()
        } else if (["i", "install", "use", "add"].includes(key)) {
            let optionName = 'install'
            if (opts[0]) {
                let option = await nodeOnlineVersion(opts[0])
                if (option.data.length === 1) {
                    if (await updateNodeVersion(option.message)) {
                        let settingStr: any = fs.readFileSync(DIR_PATH_HOME_DOT_N_SETTING_FILE)
                        let nrcStr: any = fs.readFileSync(DIR_PATH_HOME_DOT_N_DOT_NRC_FILE)
                        let { engine } = JSON.parse(settingStr)

                        process.stdout.write(`[✓] ${engine} > ${nrcStr}\n`);
                        process.exit(0);
                    }

                } else {
                    return bin(tool, [optionName, ...opts])
                }
            } else {
                return bin(tool, [optionName])
            }
        } else if (['access', 'adduser', 'audit', 'bugs', 'cache', 'ci', 'completion',
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
                let optionName = 'update'
                if (opts.length > 0) {
                    return bin(tool, [optionName, ...opts])
                } else {
                    return bin(tool, [optionName])
                }
            } else if (['ict', 'install-ci-test'].includes(key)) {
                let optionName = 'install-ci-test'
                if (opts.length > 0) {
                    return bin(tool, [optionName, ...opts])
                } else {
                    return bin(tool, [optionName])
                }
            } else if (['it', 'install-test'].includes(key)) {
                let optionName = 'install-test'
                if (opts.length > 0) {
                    return bin(tool, [optionName, ...opts])
                } else {
                    return bin(tool, [optionName])
                }
            } else if (['hs', 'help-search'].includes(key)) {
                let optionName = 'help-search'
                if (opts.length > 0) {
                    return bin(tool, [optionName, ...opts])
                } else {
                    return bin(tool, [optionName])
                }
            } else if (['rs', 'run-script'].includes(key)) {
                let optionName = 'run-script'
                if (opts.length > 0) {
                    return bin(tool, [optionName, ...opts])
                } else {
                    return bin(tool, [optionName])
                }
            } else if (['dt', 'dist-tag'].includes(key)) {
                let optionName = 'dist-tag'
                if (opts.length > 0) {
                    return bin(tool, [optionName, ...opts])
                } else {
                    return bin(tool, [optionName])
                }
            } else if (['fd', 'find-dupes'].includes(key)) {
                let optionName = 'find-dupes'
                if (opts.length > 0) {
                    return bin(tool, [optionName, ...opts])
                } else {
                    return bin(tool, [optionName])
                }
            } else {
                return bin(tool, process.argv.slice(2))
            }
        } else if (["un", "rm", "del", "uninstall", "remove", "delete"].includes(key)) {
            let optionName = 'uninstall'
            if (opts[0]) {
                let option = await nodeOnlineVersion(opts[0])
                if (option.data.length === 1) {
                    return removeNodeVersion(opts[0])

                } else {
                    return bin(tool, [optionName, ...opts])
                }
            } else {
                return MSG_NODE_VERSION_NOT_FOULT
            }
        } else if (["ls", "list"].includes(key)) {
            if (opts[0]) {
                return nodeLocalVersion(opts[0])
            } else {
                return nodeLocalVersion()
            }
        } else if (["lsr", "list-remote"].includes(key)) {
            if (opts[0]) {
                let nodeVersions = await nodeOnlineVersion(opts[0])
                return nodeVersions.message
            } else {
                let nodeVersions = await nodeOnlineVersion()
                return nodeVersions.message

            }
        } else if (key === "run") {
            return n(opts)
        } else if (key === "setup") {
            let val = await setup()
            if (val) {
                return `[✓] Setup\n`
            }

        } else if (['set-tool=npm', 'set-tool=yarn', 'set-tool=pnpm'].includes(key)) {
            let val = await setTool(key)
            if (val) {
                return `[✓] Tool\n`
            }
        } else {
            return n([key, ...opts])
        }


    } catch (err) {
        return `${err}`
    }
}