// import { spawn } from 'child_process'
// import { readNodeVersion } from './engine-fs';
// import { DIR_PATH_HOME_DOT_N_VERSION_FOLDER } from './common';
// import { engineNPXBin } from './engine-bin';
// import path from 'path'

export async function npx(options: any[]) {
    try {
        let op: any = options.toString()
        return `npx ${op.replaceAll(',', ' ')}`
        // const version: string = await readNodeVersion()
        // const path_bin: string = engineNPXBin()
        // const node_bin_file = path.join(DIR_PATH_HOME_DOT_N_VERSION_FOLDER, version, path_bin)
        // const ls: any = spawn(node_bin_file, options, {
        //     stdio: ['pipe', 'pipe', process.stderr],
        //     shell: true
        // });

        // // ส่งข้อมูล 'Yes' ไปยัง stdin ของ child process
        // // ls.stdin.write(process.argv.slice(1));

        // // // ปิด stdin stream หลังจากส่งข้อมูล
        // // ls.stdin.end();

        // // อ่าน output จาก stdout
        // ls.stdout.on('data', (data: any) => {
        //     console.log("stdout");
        //     process.stdout.write(`${data}`);
        //     ls.stdin.write(process.argv.slice(1));
        // });

        // ls.stderr.on('data', (data: any) => {
        //     // console.log(`${data}`);
        //     console.log("stderr");
        //     process.stderr.write(`${data}`);

        // });

        // ls.on('close', (code: any) => {
        //     // process.stdout.write(`child process close all stdio with code ${code}`);
        // });

        // ls.on('exit', (code: any) => {
        //     // process.stdout.write(`child process exited with code ${code}`);
        // });
    } catch (err: any) {
        return `${err}`
        // process.stdout.write(`${err}`);
    }
}
