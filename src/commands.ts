import * as fs from 'fs'
import { DIR_PATH_HOME_DOT_N_DOT_NRC_FILE, DIR_PATH_HOME_DOT_N_SETTING_FILE, DIR_PATH_HOME_FOLDER, MSG_NODE_NOT_VERSION_TYPE, MSG_NODE_VERSION_NOT_FOULT } from "./common";
import { updateEnvironmentVariables, updateNodeVersion } from "./update";
import { nodeOnlineVersion } from "./node-version";
import { options } from "./options";
import { n } from "./n";
import { setup } from './setup';
import { spawn } from 'child_process';

export async function commands(keys: any[]) {

    try {
        var option = await nodeOnlineVersion(keys[0])
        let settingStr: any = fs.readFileSync(DIR_PATH_HOME_DOT_N_SETTING_FILE)
        let version: any = fs.readFileSync(DIR_PATH_HOME_DOT_N_DOT_NRC_FILE)
        if (keys[0]) {
            if (option.data.length > 0) {
                if (option.data.length === 1) {
                    if (await updateNodeVersion(option.message)) {

                        let { engine } = JSON.parse(settingStr)

                        process.stdout.write(`[✓] ${engine} > ${version}\n`);
                        process.exit(0);
                    }
                } else {
                    process.stdout.write(`${option.message}\n`);
                    process.exit(0);
                }
            } else if (option.message === MSG_NODE_VERSION_NOT_FOULT) {
                process.stdout.write(`${option.message}\n`);
                process.exit(0);
            } else if (option.message === MSG_NODE_NOT_VERSION_TYPE) {

                let option = await options(keys[0])
                if (option) {
                    let cmd: any[] = option.split(" ")
                    const [tool, ...opts] = cmd

                    if ((opts.includes('install') || opts.includes('add')) && (opts.includes('-g') || opts.includes('global'))) {
                        let child = spawn(`${tool}`, opts, {
                            stdio: ['pipe', 'pipe', process.stderr],
                            shell: true
                        });

                        child.stdout.on('data', (data) => {
                            process.stdout.write(data);
                        });

                        child.on('error', (error: any) => {
                            process.stdout.write(error);
                        });

                        child.on('close', (code) => {
                            updateEnvironmentVariables(version)
                            process.exit(0);
                        });
                    } else if (option === version) {
                        process.stdout.write(`${option}\n`);
                        process.exit(0);
                    } else {
                        let child = spawn(`${tool}`, opts, {
                            stdio: ['pipe', 'pipe', process.stderr],
                            shell: true
                        });

                        child.stdout.on('data', (data) => {
                            process.stdout.write(data);
                        });

                        child.on('error', (error: any) => {
                            process.stdout.write(error);
                        });

                        child.on('close', (code) => {
                            process.exit(0);
                        });
                    }

                } else {
                    let nStr = await n(keys)
                    if (nStr) {
                        process.stdout.write(nStr);
                        process.exit(0);
                    }


                }

            }
        } else {
            const folders = fs.readdirSync(DIR_PATH_HOME_FOLDER);
            if (!folders.includes('.n')) {
                let val = await setup()
                if (val) {
                    let settingStr: any = fs.readFileSync(DIR_PATH_HOME_DOT_N_SETTING_FILE)
                    let { engine, tool } = JSON.parse(settingStr)
                    process.stdout.write(`[✓] Setup\n`);
                    process.stdout.write(`Engine: ${engine}\n`);
                    process.stdout.write(`Tool: ${tool}\n`);
                    process.exit(0);
                }
            } else {
                let settingStr: any = fs.readFileSync(DIR_PATH_HOME_DOT_N_SETTING_FILE)
                let { engine, tool } = JSON.parse(settingStr)
                process.stdout.write(`Engine: ${engine}\n`);
                process.stdout.write(`Tool: ${tool}\n`);
                process.exit(0);
            }

        }
    } catch (err) {
        console.log(`${err}`);
        process.exit(0);

    }

}
