import { VERSION } from "./common"
import { engineNodeBin, engineNPMBin } from "./engine-bin"
import { spawnSync } from 'child_process'


export async function engineStatus() {
    try {
        const path_bin_node: string = await engineNodeBin()
        const path_bin_npm: string = await engineNPMBin()
        const nodeStdout = await spawnSync(path_bin_node, ['--version'], {
            stdio: ['pipe', 'pipe', process.stderr],
            shell: true,
            encoding: 'utf8',
        })
        const npmStdout = await spawnSync(path_bin_npm, ['--version'], {
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