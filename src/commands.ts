import * as fs from 'fs'
import { DIR_PATH_HOME_DOT_N_DOT_NRC_FILE, DIR_PATH_HOME_DOT_N_SETTING_FILE, DIR_PATH_HOME_FOLDER, MSG_NODE_NOT_VERSION_TYPE, MSG_NODE_VERSION_NOT_FOULT } from "./common";
import { updateNodeVersion } from "./update";
import { nodeOnlineVersion } from "./node-version";
import { options } from "./options";
import { n } from "./n";
import { setup } from './setup';

export async function commands(keys: any[]) {

    try {
        var option = await nodeOnlineVersion(keys[0])

        if (keys[0]) {
            if (option.data.length > 0) {
                if (option.data.length === 1) {
                    if (await updateNodeVersion(option.message)) {
                        let settingStr: any = fs.readFileSync(DIR_PATH_HOME_DOT_N_SETTING_FILE)
                        let nrcStr: any = fs.readFileSync(DIR_PATH_HOME_DOT_N_DOT_NRC_FILE)
                        let { engine } = JSON.parse(settingStr)
                       
                        process.stdout.write(`[✓] ${engine} > ${nrcStr}\n`);
                        process.exit(0);
                    }
                } else {
                    console.log(option.message);
                    process.exit(0);
                }
            } else if (option.message === MSG_NODE_VERSION_NOT_FOULT) {
                console.log(option.message);
            } else if (option.message === MSG_NODE_NOT_VERSION_TYPE) {

                let option = await options(keys[0])
                if (option) {
                    console.log(option);
                    process.exit(0);
                } else {
                    let nStr = await n(keys)
                    console.log(nStr);
                    process.exit(0);

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
