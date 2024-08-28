// import { spawn } from 'child_process'
// import { readNodeVersion } from './engine-fs';
// import { DIR_PATH_HOME_DOT_N_VERSION_FOLDER } from './common';
// import { engineNPMBin } from './engine-bin';
// import path from 'path'

export async function npm(options: any[]) {
    try {
        let op: any = options.toString()
        return `npm ${op.replaceAll(',', ' ')}`
        // const version: string = await readNodeVersion()
        // const path_bin: string = engineNPMBin()
        // const node_bin_file = path.join(DIR_PATH_HOME_DOT_N_VERSION_FOLDER, version, path_bin)

        // const ls: any = spawn(node_bin_file, options, {
        //     stdio: ['pipe', 'pipe', process.stderr],
        //     shell: true
        // });

        // ls.stdout.on('data', (data: any) => {
        //     // console.log(`${data}`);
        //     process.stdout.write(`${data}`);
        // });

        // ls.on('close', (code: any) => {
        //     // process.stdout.write(`child process close all stdio with code ${code}`);
        // });

        // ls.on('exit', (code: any) => {
        //     // process.stdout.write(`child process exited with code ${code}`);
        // });
    } catch (err: any) {
        // process.stdout.write(`${err}`);
        return `${err}`
    }
}
