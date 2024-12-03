import * as fs from 'fs'
import * as path from 'path'
import { DIR_PATH_HOME_DOT_N_DOT_NRC_FILE, DIR_PATH_HOME_DOT_N_SETTING_FILE, DIR_PATH_HOME_DOT_N_VERSION_FOLDER, DIR_PATH_HOME_FOLDER, DIR_PATH_PROJECT_DOT_NODE_VERSION_FILE, DIR_PATH_PROJECT_DOT_NRC_FILE, DIR_PATH_PROJECT_DOT_NVMRC_FILE, DIR_PATH_PROJECT_PACKAGE_JSON_FILE, MSG_NODE_NOT_VERSION_TYPE, MSG_NODE_VERSION_NOT_FOULT } from "./common";
import { updateEnvironmentVariables, updateNodeVersion } from "./update";
import { options } from "./options";
import { setup } from './setup';
import { exec, spawn } from 'child_process';
import readline from 'readline';
// import pkg from './pkg';
// import readFileVersion from './read-file-version';
import { engineStatus } from './engine-stataus';
import { nodeLocalVersion } from './node-version';

// export function cmdScript(pathEngine: string, pathTool: string, options: string) {

//     return `
// @ECHO off
// GOTO start
// :find_dp0
// SET dp0=%~dp0
// EXIT /b
// :start
// SETLOCAL
// CALL :find_dp0

// IF EXIST "${pathEngine}\\node.exe" (
//   SET "_prog=${pathEngine}\\node.exe"
// ) ELSE (
//   SET "_prog=node"
//   SET PATHEXT=%PATHEXT:;.JS;=;%
// )

// endLocal & goto #_undefined_# 2>NUL || title %COMSPEC% & "%_prog%"  "${pathEngine}\\node_modules\\${pathTool}" ${options}
//     `
// }

// const binPath: any = {
//     npm: 'npm\\bin\\npm-cli.js',
//     npx: 'npm\\bin\\npx-cli.js',
//     yarn: 'yarn\\bin\\yarn.js',
//     yarnpkg: 'yarn\\bin\\yarn.js',
//     pnpm: 'pnpm\\bin\\pnpm.cjs',
//     pnpx: 'pnpm\\bin\\pnpx.cjs',
//     bun: 'bun\\bin\\bun.exe',
//     bunx: 'bun\\bin\\bun.exe'

// }

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

export async function commands() {

    const opts = process.argv.slice(2)[0]

    if (opts) {

        let engines: any = await engineStatus()


        let engine = engines.find((val: any) => val.type === 'engine')
        let tool = engines.find((val: any) => val.type === 'tool')

        // let localVersion: any = await nodeLocalVersion(engine.value)

        const cmd: any = await options(opts)
        let [key, ...keys] = cmd.value.split(' ')

        // let code = cmdScript(path.join(DIR_PATH_HOME_DOT_N_VERSION_FOLDER, engine.value).replace(/\//g, '\\\\'), binPath[key], keys.toString().split(",").join(" "))


        if (cmd.type === 'script') {
            let cmdArr = cmd.value.split(" ")
            if (["npm", 'yarn', 'pnpm', 'bun'].includes(cmdArr[0])) {
                if (cmdArr[0] === 'yarn') {
                    if (cmdArr[1].includes('global')) {
                        let version: any = fs.readFileSync(DIR_PATH_HOME_DOT_N_DOT_NRC_FILE)
                        exec(cmd.value, (error, stdout, stderr) => {
                            if (error) {
                                console.error(error);
                                return;
                            }

                            if (stdout) {
                                console.log(stdout);
                                updateEnvironmentVariables(version)
                                return;
                            }

                            if (stderr) {
                                console.error(stderr);
                                return;
                            }
                        });
                    } else {
                        exec(cmd.value, (error, stdout, stderr) => {
                            if (error) {
                                console.error(error);
                                return;
                            }

                            if (stdout) {
                                console.log(stdout);
                                return;
                            }

                            if (stderr) {
                                console.error(stderr);
                                return;
                            }
                        });
                    }
                } else {
                    if (cmdArr.length > 2 && cmdArr[2].includes('-g')) {
                        let version: any = fs.readFileSync(DIR_PATH_HOME_DOT_N_DOT_NRC_FILE)
                        exec(cmd.value, (error, stdout, stderr) => {
                            if (error) {
                                console.error(error);
                                return;
                            }

                            if (stdout) {
                                console.log(stdout);
                                updateEnvironmentVariables(version)
                                return;
                            }

                            if (stderr) {
                                console.error(stderr);
                                return;
                            }
                        });
                    } else {
                        // console.log(cmd.value);


                        // exec(cmd.value, (error, stdout, stderr) => {
                        //     if (error) {
                        //         console.error(error);
                        //         return;
                        //     }

                        //     if (stdout) {
                        //         console.log(stdout);
                        //         return;
                        //     }

                        //     if (stderr) {
                        //         console.error(stderr);
                        //         return;
                        //     }
                        // });

                        // cmd.value.split(" ").slice(0)

                        const cmdd = spawn(`${cmd.value.split(" ").slice(0)[0]}`,cmd.value.split(" ").slice(1), {
                            stdio: ['pipe', 'pipe', process.stderr],
                            shell: true
                        });

                        // ฟังก์ชันที่รับข้อมูลจากผู้ใช้และส่งให้กับ child process
                      
                        // รับผลลัพธ์จาก stdout ของ child process
                        cmdd.stdout.on('data', (data) => {
                            console.log(`Child Process Output: ${data}`);
                            cmdd.stdin.write(data)
                        });

                       

                    

                        // เมื่อ child process ปิด
                        cmdd.on('close', (code) => {
                            console.log(`Child process exited with code ${code}`);
                            rl.close();
                        });

                    }
                }
            } else {
                exec(cmd.value, (error, stdout, stderr) => {
                    if (error) {
                        console.error(error);
                        return;
                    }

                    if (stdout) {
                        console.log(stdout);
                        return;
                    }

                    if (stderr) {
                        console.error(stderr);
                        return;
                    }
                });
            }
            // process.stdout.write(cmd.value);
            // process.exit(0);

        } else {
            // process.stdout.write(cmd.value);
            // process.exit(0);
        }
    } else {
        const folders = fs.readdirSync(DIR_PATH_HOME_FOLDER);
        if (!folders.includes('.n')) {
            let val = await setup()
            if (val) {
                let settingStr: any = fs.readFileSync(DIR_PATH_HOME_DOT_N_SETTING_FILE)
                let { engine, tool } = JSON.parse(settingStr)
                let engineVersion: any = fs.readFileSync(DIR_PATH_HOME_DOT_N_DOT_NRC_FILE)
                let toolVersion = JSON.parse(fs.readFileSync(path.join(DIR_PATH_HOME_DOT_N_VERSION_FOLDER, engineVersion, 'node_modules', tool, 'package.json'), 'utf8')).version
                process.stdout.write(`[✓] Setup\n`);
                process.stdout.write(`Engine: ${engine} > v${engineVersion.split("v").join("")}\n`);
                process.stdout.write(`Tool: ${tool} v${toolVersion.split("v").join("")}\n`);

            }
        } else {

            let engines: any = await engineStatus()

            let engine = engines.find((val: any) => val.type === 'engine')
            let tool = engines.find((val: any) => val.type === 'tool')

            let localVersion: any = await nodeLocalVersion(engine.value)
            if (localVersion) {
                let update = await updateNodeVersion(engine.value)
                if (update) {
                    let pathTool = path.join(DIR_PATH_HOME_DOT_N_VERSION_FOLDER, localVersion, 'node_modules', tool.key, 'package.json')
                    let toolVersion = JSON.parse(fs.readFileSync(pathTool, 'utf8')).version
                    process.stdout.write(`Engine: ${engine.key} > ${engine.value}\n`);
                    process.stdout.write(`Tool: ${tool.key} > v${toolVersion.split("v").join("")}\n`);
                }
            } else {
                let update = await updateNodeVersion(engine.value)
                if (update) {
                    let toolVersion = JSON.parse(fs.readFileSync(path.join(DIR_PATH_HOME_DOT_N_VERSION_FOLDER, engine.value, 'node_modules', tool.key, 'package.json'), 'utf8')).version
                    process.stdout.write(`[✓] Setup\n`);
                    process.stdout.write(`Engine: ${engine.key} > ${engine.value}\n`);
                    process.stdout.write(`Tool: ${engine.key} > v${toolVersion.split("v").join("")}\n`);

                }
            }


        }
    }
}