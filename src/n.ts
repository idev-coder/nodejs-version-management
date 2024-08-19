
import { DIR_PATH_PROJECT_PACKAGE_JSON_FILE, MSG_NODE_VERSION_NOT_FOULT } from "./common"
import { readFileSystem, readNodeVersion } from "./engine-fs"
import { node } from './node'
import { npm } from "./npm"
import { npx } from "./npx"

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

        strToArr = options[0].split("")
        if (version) {
            if (strToArr[0].includes(".")) {
                stdout = node(options);
                // console.log(stdout);
                return stdout

            } else if (strToArr[0].includes("/")) {
                stdout = node(options);
                // console.log(stdout);
                return stdout
            } else {
                if (options[0].includes(".mjs")) {
                    stdout = node(options);
                    // console.log(stdout);
                    return stdout
                } else if (options[0].includes(".js")) {
                    stdout = node(options);
                    // console.log(stdout);
                    return stdout
                } else {
                    const packageScripts = pkgScripts()
                    if (packageScripts[`${options[0]}`]) {
                        if (options[0] === "start") {
                            stdout = npm([options[0]])
                            // console.log(stdout);
                            return stdout
                        } else {
                            stdout = npm(["run", options[0]])
                            // console.log(stdout);
                            return stdout
                        }
                    } else {

                        // console.log(MSG_NODE_VERSION_NOT_FOULT);
                        return npx(options)
                    }
                }

            }
        } else {
            // console.log(MSG_NODE_VERSION_NOT_FOULT);
            return MSG_NODE_VERSION_NOT_FOULT
        }

    } catch (err: any) {
        return err
    }
}