import { spawn } from 'child_process'
import { readNodeVersion } from './engine-fs';
import { DIR_PATH_HOME_DOT_N_VERSION_FOLDER } from './common';
import { engineNodeBin } from './engine-bin';
import path from 'path'

export async function node(options: any[]) {
    try {
        const version: string = await readNodeVersion()
        const path_bin: string = engineNodeBin()
        const node_bin_file = path.join(DIR_PATH_HOME_DOT_N_VERSION_FOLDER, version, path_bin)

        const ls = spawn(node_bin_file, options, {
            stdio: ['pipe', 'pipe', process.stderr],
            shell: true
        });

        ls.stdout.on('data', (data) => {
            // console.log(`${data}`);
            process.stdout.write(`${data}`);
        });

        ls.on('close', (code) => {
            // process.stdout.write(`child process close all stdio with code ${code}`);
        });

        ls.on('exit', (code) => {
            // process.stdout.write(`child process exited with code ${code}`);
        });
    } catch (err: any) {
        process.stdout.write(`${err}`);
    }
}

