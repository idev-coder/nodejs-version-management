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
        const opts = process.argv.slice(2).toString().split(" ")

        let settingStr: any = fs.readFileSync(DIR_PATH_HOME_DOT_N_SETTING_FILE)
        let { engine, tool } = JSON.parse(settingStr)

        if (["v", "version", "-v", "-V", "-version", "--version"].includes(opts[0])) {
            return `v${VERSION}`
        } else if (["h", "help", "-h", "-H", "--help"].includes(opts[0])) {
            return help()
        } else if (["i", "install", "use", "add"].includes(opts[0])) {
            let optionName = tool === 'npm' ? 'install' : 'add'
            if (opts.length > 0) {
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
                    if (opts.length < 2) {
                        if(['npm','pnpm'].includes(tool) ) {
                            return bin(tool, ['install'])
                        }else if(tool === 'yarn') {
                            return bin(tool,[])
                        }
                        
                    }else {
                        let [opt0, opt1, opt2, ...opt3] = opts
                        let packageName = !['-g', '-G', 'global', '--global', '-w', '-W', '--workspace', 'workspace', '--dev', '-d', '-D', '--save-dev'].includes(opt1) ? opt1 : opt2
                        if (['-g', '-G', 'global', '--global'].includes(opt1) || ['-g', '-G', 'global', '--global'].includes(opt2)) {
                            let installGlobal = tool === 'yarn' ? 'global' : '-g'
                            return bin(tool, [optionName, installGlobal, packageName, ...opt3])
                        } else if (['-w', '-W', '--workspace', 'workspace'].includes(opt1) || ['-w', '-W', '--workspace', 'workspace'].includes(opt2)) {
                            let installWorkspace = tool === 'yarn' ? 'workspace' : '--workspace'
                            return bin(tool, [optionName, installWorkspace, packageName, ...opt3])
                        } else if (['--dev', '-d', '-D', '--save-dev'].includes(opt1) || ['--dev', '-d', '-D', '--save-dev'].includes(opt2)) {
                    
                            if(['npm'].includes(tool)) {
                                return bin(tool, ['install', '-D', packageName, ...opt3])
                            } else if(['yarn'].includes(tool)) {
                                return bin(tool, ['add', '-D', packageName, ...opt3])
                            }else if(['pnpm'].includes(tool)) {
                                return bin(tool, ['add', '-D', packageName, ...opt3])
                            }
                         
                        } else {
                            return bin(tool, [optionName, ...(opt3 as any[]).shift()])
                        }
                    }
                    
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
            'view', 'whoami'].includes(opts[0])) {


            if (['u', 'update', 'upgrade'].includes(opts[0])) {
                let optionName = tool === 'yarn' ? 'upgrade' : 'update'
                if (opts.length > 0) {
                    return bin(tool, [optionName, ...opts])
                } else {
                    return bin(tool, [optionName])
                }
            } else if (['ict', 'install-ci-test'].includes(opts[0])) {
                let optionName = 'install-ci-test'
                if (opts.length > 0) {
                    return bin(tool, [optionName, ...opts])
                } else {
                    return bin(tool, [optionName])
                }
            } else if (['it', 'install-test'].includes(opts[0])) {
                let optionName = 'install-test'
                if (opts.length > 0) {
                    return bin(tool, [optionName, ...opts])
                } else {
                    return bin(tool, [optionName])
                }
            } else if (['hs', 'help-search'].includes(opts[0])) {
                let optionName = 'help-search'
                if (opts.length > 0) {
                    return bin(tool, [optionName, ...opts])
                } else {
                    return bin(tool, [optionName])
                }
            } else if (['rs', 'run-script'].includes(opts[0])) {
                let optionName = 'run-script'
                if (opts.length > 0) {
                    return bin(tool, [optionName, ...opts])
                } else {
                    return bin(tool, [optionName])
                }
            } else if (['dt', 'dist-tag'].includes(opts[0])) {
                let optionName = 'dist-tag'
                if (opts.length > 0) {
                    return bin(tool, [optionName, ...opts])
                } else {
                    return bin(tool, [optionName])
                }
            } else if (['fd', 'find-dupes'].includes(opts[0])) {
                let optionName = 'find-dupes'
                if (opts.length > 0) {
                    return bin(tool, [optionName, ...opts])
                } else {
                    return bin(tool, [optionName])
                }
            } else {
                return bin(tool, process.argv.slice(2))
            }
        } else if (["un", "rm", "del", "uninstall", "remove", "delete"].includes(opts[0])) {
            let optionName = tool === 'npm' ? 'uninstall' : 'remove'
            if (opts.length > 0) {
                let option = await nodeOnlineVersion(opts[0])
                if (option.data.length === 1) {
                    return removeNodeVersion(opts[0])

                } else {
                    if (opts.length < 2) {
                        return bin(tool, [optionName])
                    }else {
                        let [opt0, opt1, opt2, ...opt3] = opts
                        let packageName = !['-g', '-G', 'global', '--global', '-w', '-W', '--workspace', 'workspace', '--dev', '-d', '-D', '--save-dev'].includes(opt1) ? opt1 : opt2
                        if (['-g', '-G', 'global', '--global'].includes(opt1) || ['-g', '-G', 'global', '--global'].includes(opt2)) {
                            let installGlobal = tool === 'yarn' ? 'global' : '-g'
                            return bin(tool, [optionName, installGlobal, packageName, ...opt3])
                        } else if (['-w', '-W', '--workspace', 'workspace'].includes(opt1) || ['-w', '-W', '--workspace', 'workspace'].includes(opt2)) {
                            let installWorkspace = tool === 'yarn' ? 'workspace' : '--workspace'
                            return bin(tool, [optionName, installWorkspace, packageName, ...opt3])
                        } else if (['--dev', '-d', '-D', '--save-dev'].includes(opt1) || ['--dev', '-d', '-D', '--save-dev'].includes(opt2)) {
                            let installDev = tool === 'npm' ? '--save-dev' : '--dev'
                            return bin(tool, [optionName, installDev, packageName, ...opt3])
                        } else {
                            return bin(tool, [optionName, ...(opt3 as any[]).shift()])
                        }
                    }
                }
            } else {
                return MSG_NODE_VERSION_NOT_FOULT
            }
        } else if (["ls", "list"].includes(opts[0])) {
            if (opts[0]) {
                return nodeLocalVersion(opts[0])
            } else {
                return nodeLocalVersion()
            }
        } else if (["lsr", "list-remote"].includes(opts[0])) {
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

        } else if (['set-tool=npm', 'set-tool=yarn', 'set-tool=pnpm', 'set-tool=bun'].includes(opts[0])) {
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