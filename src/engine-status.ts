import { DIR_PATH_HOME_DOT_N_VERSION_FOLDER, VERSION } from "./common"
import { engineNodeBin, engineNPMBin } from "./engine-bin"
import { spawnSync } from 'child_process'
import { readNodeVersion } from "./engine-fs"
import path from 'path'

export async function engineStatus() {
    try {
        var version: any = await readNodeVersion()
        const bin_node: string = await engineNodeBin()
        const bin_npm: string = await engineNPMBin()
        const path_node = path.join(DIR_PATH_HOME_DOT_N_VERSION_FOLDER, version, bin_node)
        const path_npm = path.join(DIR_PATH_HOME_DOT_N_VERSION_FOLDER, version, bin_npm)

        const nodeStdout = await spawnSync(path_node, ['--version'], {
            stdio: ['pipe', 'pipe', process.stderr],
            shell: true,
            encoding: 'utf8',
        })
        const npmStdout = await spawnSync(path_npm, ['--version'], {
            stdio: ['pipe', 'pipe', process.stderr],
            shell: true,
            encoding: 'utf8',
        })

        return `
n v${VERSION}

node ${typeof nodeStdout.stdout === 'string' ? nodeStdout.stdout : "node not install"}
npm v${typeof npmStdout.stdout === 'string' ? npmStdout.stdout : "node not install"}
        `
    } catch (err: any) {
        return err
    }

}