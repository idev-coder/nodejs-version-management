import { DIR_PATH_HOME_DOT_N_VERSION_FOLDER, VERSION } from "./common"
import { engineNodeBin, engineNPMBin } from "./engine-bin"
import { spawn } from 'child_process'
import { readNodeVersion } from "./engine-fs"
import path from 'path'

export async function engineStatus() {
    try {
        var version: any = await readNodeVersion()
        const bin_node: any = engineNodeBin()
        const bin_npm: any = engineNPMBin()
        const path_node: string = path.join(`${DIR_PATH_HOME_DOT_N_VERSION_FOLDER}`, `${version}`, `${bin_node}`)
        const path_npm: string = path.join(`${DIR_PATH_HOME_DOT_N_VERSION_FOLDER}`, `${version}`, `${bin_npm}`)

        process.stdout.write(`n v${VERSION}`);
        const node = spawn(path_node, ['--version'], {
            stdio: ['pipe', 'pipe', process.stderr],
            shell: true,
        })
        node.stdout.on('data', (data) => {
            process.stdout.write(`\nnode ${data}`);
        });
        const npm = spawn(path_npm, ['--version'], {
            stdio: ['pipe', 'pipe', process.stderr],
            shell: true,
        })
        npm.stdout.on('data', (data) => {
            process.stdout.write(`\nnpm v${data}`);
        });

    } catch (err: any) {

        console.log(err);

    }

}