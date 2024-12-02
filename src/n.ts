
import * as fs from 'fs'
import { DIR_PATH_HOME_DOT_N_SETTING_FILE, DIR_PATH_PROJECT_PACKAGE_JSON_FILE, MSG_NODE_VERSION_NOT_FOULT } from "./common"
import { readFileSystem, readNodeVersion } from "./engine-fs"
import { bin } from "./bin"

function pkgScripts() {
    const pkgStr = readFileSystem(DIR_PATH_PROJECT_PACKAGE_JSON_FILE)
    const pkg = JSON.parse(pkgStr)
    return pkg.scripts
}

export async function n(options: any[]) {
    try {
        var version: string = await readNodeVersion()
        var strToArr: any[]
        var stdout: any
        const settingStr: any = fs.readFileSync(DIR_PATH_HOME_DOT_N_SETTING_FILE)
        const { engine, tool } = JSON.parse(settingStr)


        strToArr = options[0].split("")
        if (version) {
            if (strToArr[0].includes(".") || strToArr[0].includes("/")) {
                return bin(engine, options)

            } else {
                if (options[0].includes(".mjs") || options[0].includes(".js")) {
                    return bin(engine, options)
                } else if (options[0].includes(".mts") || options[0].includes(".ts")) {
                
                    return bin("deno", ['run', ...options])

                }else if (options[0].includes("http://") || options[0].includes("https://")) {
                
                    return bin("deno", ['run', ...options])

                } else {
                    const packageScripts = pkgScripts()
                    if (packageScripts[`${options[0]}`]) {
                        if (options[0] === "start") {
                            return bin(tool, [options[0]])
                        } else {
                            return bin(tool, ["run", options[0]])
                        }
                    } else {
                        if (tool === 'npm') {
                            return bin('npx', options)
                        } else if (tool === 'pnpm') {
                            return bin('pnpx', options)
                        } else if (tool === 'bun') {
                            return bin('bunx', options)
                        } else if (tool === 'yarn') {
                            return bin('yarnpkg', options)
                        }
                    }
                }

            }
        } else {
            return MSG_NODE_VERSION_NOT_FOULT
        }

    } catch (err: any) {
        return `${err}`
    }
}