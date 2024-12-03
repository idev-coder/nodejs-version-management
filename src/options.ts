import * as fs from 'fs'
import { DIR_PATH_HOME_DOT_N_DOT_NRC_FILE, DIR_PATH_HOME_DOT_N_SETTING_FILE, VERSION } from "./common";
import { removeNodeVersion } from "./engine-fs";
import { help } from "./help";
import { nodeLocalVersion, nodeOnlineVersion } from "./node-version";
import { updateNodeVersion } from "./update";
import { setup } from "./setup";
import { setTool } from "./set-tool";
import { scriptNames } from './pkg'
import { setEngine } from './set-engine';

export function options(opts: string) {
    return new Promise(async (res, rej) => {
        const settingStr: any = fs.readFileSync(DIR_PATH_HOME_DOT_N_SETTING_FILE)
        var { engine, tool } = JSON.parse(settingStr)
        const opt1 = opts.split(" ").slice(0)[0]

        if (["version", "-v", "-V", "-version", "--version"].includes(opt1)) {
            res({
                type: 'message',
                value: `v${VERSION}`
            })

        } else if (["h", "help", "-h", "-H", "--help"].includes(opt1)) {
            res({
                type: 'message',
                value: help()
            })

        } else if (["ls", "list"].includes(opt1)) {
            res({
                type: 'message',
                value: nodeLocalVersion()
            })

        } else if (["lsr", "list-remote"].includes(opt1)) {
            if (opts.split(" ").slice(1)[0]) {
                let nodeVersions = await nodeOnlineVersion(opts.split(" ").slice(1)[0])
                res({
                    type: 'message',
                    value: nodeVersions.message
                })
            } else {
                let nodeVersions = await nodeOnlineVersion()
                res({
                    type: 'message',
                    value: nodeVersions.message
                })
            }


        } else if (["setup"].includes(opt1)) {
            let val = await setup()
            if (val) {
                res({
                    type: 'message',
                    value: `[✓] Setup\n`
                })
            }
        } else if (['set-tool=npm', 'set-tool=yarn', 'set-tool=pnpm', 'set-tool=bun'].includes(opt1)) {
            let val = await setTool(opt1)
            if (val) {
                res({
                    type: 'message',
                    value: `[✓] Set Tool\n`
                })
            }
        } else if (['upgrade'].includes(opt1)) {
            let toolScript: any = {
                npm: 'install',
                yarn: '',
                pnpm: '',
                bun: ''
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], '-g', '@idev-coder/n'].toString().split(",").join(" ")
            })

        } else if (['i', 'add', 'use', 'install'].includes(opt1)) {
            let toolScript: any = {
                npm: 'install',
                yarn: 'add',
                pnpm: 'add',
                bun: 'add'
            }
            tool = toolScript[tool] ? tool : 'npm'
            let toolScriptSaveOpt: any = {
                npm: '--save',
                yarn: '',
                pnpm: '',
                bun: ''
            }

            let toolScriptSaveDevOpt: any = {
                npm: '--save-dev',
                yarn: '--dev',
                pnpm: '--dev',
                bun: '--dev'
            }

            let toolScriptGlobalOpt: any = {
                npm: '-g',
                yarn: 'global',
                pnpm: '-g',
                bun: '-g'
            }

            let optSaveKeys = ['--save', '-S', '-s']
            let optSaveDevKeys = ['--save-dev', '-D', '-d', '--dev']
            let optGlobalKeys = ['--global', '--save-global', '-G', '-g']

            if (opts.split(" ").slice(1)[0]) {
                let option = await nodeOnlineVersion(opts.split(" ").slice(1)[0])
                if (option.data.length === 1) {
                    if (await updateNodeVersion(option.message)) {
                        let nrcStr: any = fs.readFileSync(DIR_PATH_HOME_DOT_N_DOT_NRC_FILE)

                        res({
                            type: `message`,
                            value: `[✓] ${engine} > ${nrcStr}\n`
                        })
                    }
                } else {
                    if (optSaveKeys.includes(opts.split(" ").slice(1)[0])) {
                        tool = toolScriptSaveOpt[tool] ? tool : 'npm'
                        res({
                            type: `script`,
                            value: [tool, toolScript[tool], toolScriptSaveOpt[tool], ...opts.split(" ").slice(2)].toString().split(",").join(" ")
                        })
                    } else if (optSaveDevKeys.includes(opts.split(" ").slice(1)[0])) {
                        res({
                            type: `script`,
                            value: [tool, toolScript[tool], toolScriptSaveDevOpt[tool], ...opts.split(" ").slice(2)].toString().split(",").join(" ")
                        })
                    } else if (optGlobalKeys.includes(opts.split(" ").slice(1)[0])) {
                        if (tool === 'yarn') {
                            res({
                                type: `script`,
                                value: [tool, toolScriptGlobalOpt[tool], toolScript[tool], ...opts.split(" ").slice(2)].toString().split(",").join(" ")
                            })
                        } else {
                            res({
                                type: `script`,
                                value: [tool, toolScript[tool], toolScriptGlobalOpt[tool], ...opts.split(" ").slice(2)].toString().split(",").join(" ")
                            })
                        }

                    } else if (optSaveKeys.includes(opts.split(" ").slice(2)[0]) || optSaveDevKeys.includes(opts.split(" ").slice(2)[0]) || optGlobalKeys.includes(opts.split(" ").slice(2)[0])) {
                        res({
                            type: `message`,
                            value: 'Not Supported'
                        })
                    } else if (opts.split(" ").slice(1).length > 0) {


                        let saveOptArr = opts.split(" ").slice(2).filter(val => {
                            if (optSaveKeys.includes(val)) {
                                return val
                            }
                        })

                        let saveDevOptArr = opts.split(" ").slice(2).filter(val => {
                            if (optSaveDevKeys.includes(val)) {
                                return val
                            }
                        })

                        let globalOptArr = opts.split(" ").slice(2).filter(val => {
                            if (optGlobalKeys.includes(val)) {
                                return val
                            }
                        })

                        let pkgAll = opts.split(" ").slice(2).filter((val) => {
                            if (!optSaveKeys.includes(val) && !optSaveDevKeys.includes(val) && !optGlobalKeys.includes(val)) {
                                return val
                            }
                        })

                        if (saveOptArr.length > 0) {
                            tool = toolScriptSaveOpt[tool] ? tool : 'npm'
                            res({
                                type: `script`,
                                value: [tool, toolScript[tool], toolScriptSaveOpt[tool], ...pkgAll].toString().split(",").join(" ")
                            })
                        } else if (saveDevOptArr.length > 0) {
                            res({
                                type: `script`,
                                value: [tool, toolScript[tool], toolScriptSaveDevOpt[tool], ...pkgAll].toString().split(",").join(" ")
                            })
                        } else if (globalOptArr.length > 0) {
                            if (tool === 'yarn') {
                                res({
                                    type: `script`,
                                    value: [tool, toolScriptGlobalOpt[tool], toolScript[tool], ...pkgAll].toString().split(",").join(" ")
                                })
                            } else {
                                res({
                                    type: `script`,
                                    value: [tool, toolScript[tool], toolScriptGlobalOpt[tool], ...pkgAll].toString().split(",").join(" ")
                                })
                            }
                        } else {
                            res({
                                type: `script`,
                                value: [tool, toolScript[tool], ...opts.split(" ").slice(2)].toString().split(",").join(" ")
                            })
                        }

                    } else {
                        res({
                            type: `script`,
                            value: [tool, toolScript['npm']].toString().split(",").join(" ")
                        })
                    }
                }
            } else {
                res({
                    type: `script`,
                    value: [tool, toolScript['npm']].toString().split(",").join(" ")
                })
            }

        } else if (['un', 'del', 'rm', 'delete', 'remove', 'uninstall'].includes(opt1)) {
            let toolScript: any = {
                npm: 'uninstall',
                yarn: 'remove',
                pnpm: 'remove',
                bun: 'remove'
            }
            tool = toolScript[tool] ? tool : 'npm'
            let toolScriptSaveOpt: any = {
                npm: '--save',
                yarn: '',
                pnpm: '',
                bun: ''
            }

            let toolScriptSaveDevOpt: any = {
                npm: '--save-dev',
                yarn: '--dev',
                pnpm: '--dev',
                bun: '--dev'
            }

            let toolScriptGlobalOpt: any = {
                npm: '-g',
                yarn: 'global',
                pnpm: '-g',
                bun: '-g'
            }

            let optSaveKeys = ['--save', '-S', '-s']
            let optSaveDevKeys = ['--save-dev', '-D', '-d', '--dev']
            let optGlobalKeys = ['--global', '-G', '-g']

            if (opts.split(" ").slice(1)[0]) {
                let option = await nodeOnlineVersion(opts.split(" ").slice(1)[0])
                if (option.data.length === 1) {
                    let val = await removeNodeVersion(opts.split(" ").slice(1)[0])
                    if (val) {
                        res({
                            type: 'message',
                            value: `[✓] Remove ${engine} > ${opts.split(" ").slice(1)[0]}\n`
                        })
                    }
                } else {
                    if (optSaveKeys.includes(opts.split(" ").slice(1)[0])) {
                        tool = toolScriptSaveOpt[tool] ? tool : 'npm'
                        res({
                            type: `script`,
                            value: [tool, toolScript[tool], toolScriptSaveOpt[tool], ...opts.split(" ").slice(2)].toString().split(",").join(" ")
                        })
                    } else if (optSaveDevKeys.includes(opts.split(" ").slice(1)[0])) {
                        res({
                            type: `script`,
                            value: [tool, toolScript[tool], toolScriptSaveDevOpt[tool], ...opts.split(" ").slice(2)].toString().split(",").join(" ")
                        })
                    } else if (optGlobalKeys.includes(opts.split(" ").slice(1)[0])) {
                        if (tool === 'yarn') {
                            res({
                                type: `script`,
                                value: [tool, toolScriptGlobalOpt[tool], toolScript[tool], ...opts.split(" ").slice(2)].toString().split(",").join(" ")
                            })
                        } else {
                            res({
                                type: `script`,
                                value: [tool, toolScript[tool], toolScriptGlobalOpt[tool], ...opts.split(" ").slice(2)].toString().split(",").join(" ")
                            })
                        }

                    } else if (optSaveKeys.includes(opts.split(" ").slice(2)[0]) || optSaveDevKeys.includes(opts.split(" ").slice(2)[0]) || optGlobalKeys.includes(opts.split(" ").slice(2)[0])) {
                        res({
                            type: `message`,
                            value: 'Not Supported'
                        })
                    } else if (opts.split(" ").slice(1).length > 0) {


                        let saveOptArr = opts.split(" ").slice(2).filter(val => {
                            if (optSaveKeys.includes(val)) {
                                return val
                            }
                        })

                        let saveDevOptArr = opts.split(" ").slice(2).filter(val => {
                            if (optSaveDevKeys.includes(val)) {
                                return val
                            }
                        })

                        let globalOptArr = opts.split(" ").slice(2).filter(val => {
                            if (optGlobalKeys.includes(val)) {
                                return val
                            }
                        })

                        let pkgAll = opts.split(" ").slice(2).filter((val) => {
                            if (!optSaveKeys.includes(val) && !optSaveDevKeys.includes(val) && !optGlobalKeys.includes(val)) {
                                return val
                            }
                        })

                        if (saveOptArr.length > 0) {
                            tool = toolScriptSaveOpt[tool] ? tool : 'npm'
                            res({
                                type: `script`,
                                value: [tool, toolScript[tool], toolScriptSaveOpt[tool], ...pkgAll].toString().split(",").join(" ")
                            })
                        } else if (saveDevOptArr.length > 0) {
                            res({
                                type: `script`,
                                value: [tool, toolScript[tool], toolScriptSaveDevOpt[tool], ...pkgAll].toString().split(",").join(" ")
                            })
                        } else if (globalOptArr.length > 0) {
                            if (tool === 'yarn') {
                                res({
                                    type: `script`,
                                    value: [tool, toolScriptGlobalOpt[tool], toolScript[tool], ...pkgAll].toString().split(",").join(" ")
                                })
                            } else {
                                res({
                                    type: `script`,
                                    value: [tool, toolScript[tool], toolScriptGlobalOpt[tool], ...pkgAll].toString().split(",").join(" ")
                                })
                            }
                        } else {
                            res({
                                type: `script`,
                                value: [tool, toolScript[tool], ...opts.split(" ").slice(2)].toString().split(",").join(" ")
                            })
                        }

                    } else {
                        res({
                            type: `script`,
                            value: [tool, toolScript['npm']].toString().split(",").join(" ")
                        })
                    }
                }
            } else {
                res({
                    type: `script`,
                    value: [tool, toolScript[tool],].toString().split(",").join(" ")
                })
            }
        } else if (['u', 'update'].includes(opt1)) {
            let toolScript: any = {
                npm: 'update',
                yarn: 'upgrade',
                pnpm: 'update',
                bun: 'upgrade'
            }
            tool = toolScript[tool] ? tool : 'npm'
            if (opts.split(" ").slice(1).length > 0) {
                res({
                    type: `script`,
                    value: [tool, toolScript[tool], ...opts.split(" ").slice(2)].toString().split(",").join(" ")
                })
            } else {
                res({
                    type: `script`,
                    value: [tool, toolScript[tool],].toString().split(",").join(" ")
                })
            }

        } else if (['run'].includes(opt1)) {
            let toolScript: any = {
                npm: 'run',
                yarn: '',
                pnpm: 'run',
                bun: 'run'
            }
            tool = toolScript[tool] ? tool : 'npm'
            if (scriptNames().includes(opts.split(" ").slice(1)[0])) {
                res({
                    type: `script`,
                    value: [tool, toolScript[tool], opts.split(" ").slice(1)[0]].toString().split(",").join(" ")
                })
            } else {
                res({
                    type: 'message',
                    value: 'No Script Name'
                })
            }

        } else if (['create'].includes(opt1)) {
            let toolScript: any = {
                npm: 'create',
                yarn: 'create',
                pnpm: 'create',
                bun: 'create'
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['access'].includes(opt1)) {
            let toolScript: any = {
                npm: 'access',
                yarn: '',
                pnpm: '',
                bun: ''
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript['npm'], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['adduser'].includes(opt1)) {
            let toolScript: any = {
                npm: 'adduser',
                yarn: '',
                pnpm: '',
                bun: ''
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript['npm'], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['audit'].includes(opt1)) {
            let toolScript: any = {
                npm: 'audit',
                yarn: 'audit',
                pnpm: 'audit',
                bun: 'audit'
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['bugs'].includes(opt1)) {
            let toolScript: any = {
                npm: 'bugs',
                yarn: '',
                pnpm: '',
                bun: ''
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['cache'].includes(opt1)) {
            let toolScript: any = {
                npm: 'cache',
                yarn: 'cache',
                pnpm: 'cache',
                bun: 'cache'
            }
            tool = toolScript[tool] ? tool : 'npm'

            let toolScriptCleanOpt: any = {
                npm: 'clean',
                yarn: 'clean',
                pnpm: 'prune',
                bun: 'clean'
            }

            let toolScriptListOpt: any = {
                npm: 'ls',
                yarn: 'list',
                pnpm: 'status',
                bun: 'list'
            }

            let toolScriptVerifyOpt: any = {
                npm: 'verify',
                yarn: '',
                pnpm: '',
                bun: ''
            }

            if (opts.split(" ").slice(1).length > 0) {
                if (opts.split(" ").slice(2).length > 0) {

                    if (['clean', 'prune'].includes(opts.split(" ").slice(1)[0])) {
                        tool = toolScriptCleanOpt[tool] ? tool : 'npm'
                        res({
                            type: `script`,
                            value: [tool, toolScript[tool], toolScriptCleanOpt[tool], ...opts.split(" ").slice(2)].toString().split(",").join(" ")
                        })
                    } else if (['ls', 'list', 'status'].includes(opts.split(" ").slice(1)[0])) {
                        tool = toolScriptListOpt[tool] ? tool : 'npm'
                        res({
                            type: `script`,
                            value: [tool, toolScript[tool], toolScriptListOpt[tool], ...opts.split(" ").slice(2)].toString().split(",").join(" ")
                        })
                    } else if (['verify'].includes(opts.split(" ").slice(1)[0])) {
                        tool = toolScriptVerifyOpt[tool] ? tool : 'npm'
                        res({
                            type: `script`,
                            value: [tool, toolScript[tool], toolScriptVerifyOpt[tool], ...opts.split(" ").slice(2)].toString().split(",").join(" ")
                        })
                    }
                } else {
                    if (['clean', 'prune'].includes(opts.split(" ").slice(1)[0])) {
                        tool = toolScriptCleanOpt[tool] ? tool : 'npm'
                        res({
                            type: `script`,
                            value: [tool, toolScript[tool], toolScriptCleanOpt[tool]].toString().split(",").join(" ")
                        })
                    } else if (['ls', 'list', 'status'].includes(opts.split(" ").slice(1)[0])) {
                        tool = toolScriptListOpt[tool] ? tool : 'npm'
                        res({
                            type: `script`,
                            value: [tool, toolScript[tool], toolScriptListOpt[tool]].toString().split(",").join(" ")
                        })
                    } else if (['verify'].includes(opts.split(" ").slice(1)[0])) {
                        tool = toolScriptVerifyOpt[tool] ? tool : 'npm'
                        res({
                            type: `script`,
                            value: [tool, toolScript[tool], toolScriptVerifyOpt[tool]].toString().split(",").join(" ")
                        })
                    }

                }

            } else {
                res({
                    type: `script`,
                    value: [tool, toolScript[tool]].toString().split(",").join(" ")
                })
            }


        } else if (['ci'].includes(opt1)) {
            let toolScript: any = {
                npm: 'ci',
                yarn: 'install --frozen-lockfile',
                pnpm: 'install --frozen-lockfile',
                bun: 'install --frozen'
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['completion'].includes(opt1)) {
            let toolScript: any = {
                npm: 'completion',
                yarn: 'completion',
                pnpm: 'completion',
                bun: 'completion'
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['config'].includes(opt1)) {
            let toolScript: any = {
                npm: 'config',
                yarn: 'config',
                pnpm: 'config',
                bun: 'config'
            }

            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['dedupe'].includes(opt1)) {
            let toolScript: any = {
                npm: 'dedupe',
                yarn: 'install --flat',
                pnpm: 'dedupe',
                bun: 'install --optimize'
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['deprecate'].includes(opt1)) {
            let toolScript: any = {
                npm: 'deprecate',
                yarn: 'deprecate',
                pnpm: 'deprecate',
                bun: ''
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['diff'].includes(opt1)) {
            let toolScript: any = {
                npm: 'diff',
                yarn: '',
                pnpm: '',
                bun: ''
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['dist-tag'].includes(opt1)) {
            let toolScript: any = {
                npm: 'dist-tag',
                yarn: '',
                pnpm: '',
                bun: ''
            }

            tool = toolScript[tool] ? tool : 'npm'


            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['docs'].includes(opt1)) {
            let toolScript: any = {
                npm: 'docs',
                yarn: '',
                pnpm: '',
                bun: ''
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['doctor'].includes(opt1)) {
            let toolScript: any = {
                npm: 'doctor',
                yarn: '',
                pnpm: '',
                bun: ''
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['edit'].includes(opt1)) {
            let toolScript: any = {
                npm: 'edit',
                yarn: 'edit',
                pnpm: 'edit',
                bun: ''
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['exec'].includes(opt1)) {
            let toolScript: any = {
                npm: 'exec',
                yarn: 'exec',
                pnpm: 'exec',
                bun: 'exec'
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['explain'].includes(opt1)) {
            let toolScript: any = {
                npm: 'explain',
                yarn: '',
                pnpm: '',
                bun: ''
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['explore'].includes(opt1)) {
            let toolScript: any = {
                npm: 'explore',
                yarn: '',
                pnpm: '',
                bun: ''
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['find-dupes'].includes(opt1)) {
            let toolScript: any = {
                npm: 'find-dupes',
                yarn: '',
                pnpm: '',
                bun: ''
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['fund'].includes(opt1)) {
            let toolScript: any = {
                npm: 'fund',
                yarn: 'fund',
                pnpm: 'fund',
                bun: ''
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['get'].includes(opt1)) {
            let toolScript: any = {
                npm: 'get',
                yarn: 'config get',
                pnpm: 'config get',
                bun: 'config get'
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['hook'].includes(opt1)) {
            let toolScript: any = {
                npm: 'hook',
                yarn: '',
                pnpm: '',
                bun: ''
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['init'].includes(opt1)) {
            let toolScript: any = {
                npm: 'init',
                yarn: 'init',
                pnpm: 'init',
                bun: 'init'
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['install-ci-test', 'icit'].includes(opt1)) {
            let toolScript: any = {
                npm: 'install-ci-test',
                yarn: '',
                pnpm: '',
                bun: ''
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['install-test', 'it'].includes(opt1)) {
            let toolScript: any = {
                npm: 'install-test',
                yarn: '',
                pnpm: '',
                bun: ''
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['link', 'l'].includes(opt1)) {
            let toolScript: any = {
                npm: 'link',
                yarn: 'link',
                pnpm: 'link',
                bun: 'link'
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['ll'].includes(opt1)) {
            let toolScript: any = {
                npm: 'll',
                yarn: '',
                pnpm: '',
                bun: ''
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['login'].includes(opt1)) {
            let toolScript: any = {
                npm: 'login',
                yarn: 'login',
                pnpm: 'login',
                bun: 'login'
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['org'].includes(opt1)) {
            let toolScript: any = {
                npm: 'org',
                yarn: '',
                pnpm: '',
                bun: ''
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['outdated'].includes(opt1)) {
            let toolScript: any = {
                npm: 'outdated',
                yarn: 'outdated',
                pnpm: 'outdated',
                bun: 'outdated'
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['owner'].includes(opt1)) {
            let toolScript: any = {
                npm: 'owner',
                yarn: 'owner',
                pnpm: 'owner',
                bun: 'owner'
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['pack'].includes(opt1)) {
            let toolScript: any = {
                npm: 'pack',
                yarn: 'pack',
                pnpm: 'pack',
                bun: 'pack'
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['ping'].includes(opt1)) {
            let toolScript: any = {
                npm: 'ping',
                yarn: '',
                pnpm: '',
                bun: ''
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['pkg'].includes(opt1)) {
            let toolScript: any = {
                npm: 'pkg',
                yarn: '',
                pnpm: '',
                bun: ''
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['prefix'].includes(opt1)) {
            let toolScript: any = {
                npm: 'prefix',
                yarn: '',
                pnpm: '',
                bun: ''
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['profile'].includes(opt1)) {
            let toolScript: any = {
                npm: 'profile',
                yarn: '',
                pnpm: '',
                bun: ''
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['prune'].includes(opt1)) {
            let toolScript: any = {
                npm: 'prune',
                yarn: 'autoclean',
                pnpm: 'prune',
                bun: 'prune'
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['publish', 'p'].includes(opt1)) {
            let toolScript: any = {
                npm: 'publish',
                yarn: 'publish',
                pnpm: 'publish',
                bun: 'publish'
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['query'].includes(opt1)) {
            let toolScript: any = {
                npm: 'query',
                yarn: '',
                pnpm: '',
                bun: ''
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['rebuild'].includes(opt1)) {
            let toolScript: any = {
                npm: 'rebuild',
                yarn: 'rebuild',
                pnpm: 'rebuild',
                bun: 'rebuild'
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['repo'].includes(opt1)) {
            let toolScript: any = {
                npm: 'repo',
                yarn: '',
                pnpm: '',
                bun: ''
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['restart'].includes(opt1)) {
            let toolScript: any = {
                npm: 'restart',
                yarn: '',
                pnpm: '',
                bun: ''
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['root'].includes(opt1)) {
            let toolScript: any = {
                npm: 'root',
                yarn: '',
                pnpm: '',
                bun: ''
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['run-script'].includes(opt1)) {
            let toolScript: any = {
                npm: 'run-script',
                yarn: 'run',
                pnpm: 'run',
                bun: 'run'
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['sbom'].includes(opt1)) {
            let toolScript: any = {
                npm: 'sbom',
                yarn: '',
                pnpm: '',
                bun: ''
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['search'].includes(opt1)) {
            let toolScript: any = {
                npm: 'search',
                yarn: 'search',
                pnpm: 'search',
                bun: ''
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['set'].includes(opt1)) {

            if (['tool'].includes(opts.split(" ").slice(1)[0])) {
                let val = await setTool(opts.split(" ").slice(2)[0])
                if (val) {
                    res({
                        type: 'message',
                        value: `[✓] Set Tool\n`
                    })
                }
            } else if (['node'].includes(opts.split(" ").slice(1)[0])) {
                let data = await setEngine(opts.split(" ").slice(1)[0], opts.split(" ").slice(2)[0])
                if(data) {
                    res(data)
                }
              
            } else if (['npm', 'yarn', 'pnpm', 'bun'].includes(opts.split(" ").slice(1)[0])) {
                let data = await setEngine(opts.split(" ").slice(1)[0], opts.split(" ").slice(2)[0])
                if(data) {
                    res(data)
                }
            }
        } else if (['shrinkwrap'].includes(opt1)) {
            let toolScript: any = {
                npm: 'shrinkwrap',
                yarn: '',
                pnpm: '',
                bun: ''
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['star'].includes(opt1)) {
            let toolScript: any = {
                npm: 'star',
                yarn: '',
                pnpm: '',
                bun: ''
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['stars'].includes(opt1)) {
            let toolScript: any = {
                npm: 'stars',
                yarn: '',
                pnpm: '',
                bun: ''
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['start'].includes(opt1)) {
            let toolScript: any = {
                npm: 'start',
                yarn: 'start',
                pnpm: 'start',
                bun: 'start'
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['stop'].includes(opt1)) {
            let toolScript: any = {
                npm: 'stop',
                yarn: '',
                pnpm: '',
                bun: ''
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['team'].includes(opt1)) {
            let toolScript: any = {
                npm: 'team',
                yarn: '',
                pnpm: '',
                bun: ''
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['test'].includes(opt1)) {
            let toolScript: any = {
                npm: 'test',
                yarn: 'test',
                pnpm: 'test',
                bun: 'test'
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['token'].includes(opt1)) {
            let toolScript: any = {
                npm: 'token',
                yarn: '',
                pnpm: '',
                bun: ''
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['unpublish'].includes(opt1)) {
            let toolScript: any = {
                npm: 'unpublish',
                yarn: 'unpublish',
                pnpm: 'unpublish',
                bun: ''
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['unstar'].includes(opt1)) {
            let toolScript: any = {
                npm: 'unstar',
                yarn: '',
                pnpm: '',
                bun: ''
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['view'].includes(opt1)) {
            let toolScript: any = {
                npm: 'view',
                yarn: 'view',
                pnpm: 'view',
                bun: ''
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['whoami'].includes(opt1)) {
            let toolScript: any = {
                npm: 'whoami',
                yarn: 'whoami',
                pnpm: 'whoami',
                bun: 'whoami'
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (['logout'].includes(opt1)) {
            let toolScript: any = {
                npm: 'logout',
                yarn: 'logout',
                pnpm: 'logout',
                bun: 'logout'
            }
            tool = toolScript[tool] ? tool : 'npm'
            res({
                type: `script`,
                value: [tool, toolScript[tool], ...opts.split(" ").slice(1)].toString().split(",").join(" ")
            })

        } else if (scriptNames() && scriptNames().includes(opt1)) {
            res({
                type: 'script',
                value: [tool, opt1].toString().split(",").join(" ")
            })
        } else {

            let strToArr = opt1.split("")
            
            
            if (strToArr[0].includes(".") || strToArr[0].includes("/")) {
                if (opt1.includes(".mjs") || opt1.includes(".js") || opt1.includes(".cjs")) {
                    res({
                        type: 'script',
                        value: [engine, ...opts.split(" ").slice(1)].toString().split(",").join(" ")
                    })
                } else if (opt1.includes(".mts") || opt1.includes(".ts")) {
                    engine = 'deno'
                    res({
                        type: 'script',
                        value: [engine, ...opts.split(" ").slice(1)].toString().split(",").join(" ")
                    })
                }

            } else {
                let reg = /^\d+$/;

                if (strToArr[0].includes("v") && reg.test(strToArr[1])) {
                    
                    let option = await nodeOnlineVersion(opts.split(" ").slice(1)[0])
                    if (option.data.length === 1) {
                        if (await updateNodeVersion(option.message)) {
                            let nrcStr: any = fs.readFileSync(DIR_PATH_HOME_DOT_N_DOT_NRC_FILE)

                            res({
                                type: `message`,
                                value: `[✓] ${engine} > ${nrcStr}\n`
                            })
                        }
                    }
                } else if (reg.test(strToArr[0])) {
                 
                    let option = await nodeOnlineVersion(opts.split(" ").slice(0)[0])
                    console.log(option.message);
                    if (option.data.length > 0) {
                        
                        if (await updateNodeVersion(option.message)) {
                            let nrcStr: any = fs.readFileSync(DIR_PATH_HOME_DOT_N_DOT_NRC_FILE)

                            res({
                                type: `message`,
                                value: `[✓] ${engine} > ${nrcStr}\n`
                            })
                        }
                    }
                } else {
                    if (tool === 'npm') {
                        tool = 'npx'
                        res({
                            type: 'script',
                            value: [tool, ...opts.split(" ").slice(0)].toString().split(",").join(" ")
                        })
                    } else if (tool === 'yarn') {
                        tool = 'yarnpkg'
                        res({
                            type: 'script',
                            value: [tool, ...opts.split(" ").slice(0)].toString().split(",").join(" ")
                        })
                    } else if (tool === 'pnpm') {
                        tool = 'pnpx'
                        res({
                            type: 'script',
                            value: [tool, ...opts.split(" ").slice(0)].toString().split(",").join(" ")
                        })
                    } else if (tool === 'bun') {
                        tool = 'bunx'
                        res({
                            type: 'script',
                            value: [tool, ...opts.split(" ").slice(0)].toString().split(",").join(" ")
                        })
                    } else {
                        res({
                            type: 'script',
                            value: [engine, ...opts.split(" ").slice(0)].toString().split(",").join(" ")
                        })
                    }

                }

            }
        }

    })
}