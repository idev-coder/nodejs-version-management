import { MSG_NODE_NOT_VERSION_TYPE, MSG_NODE_VERSION_NOT_FOULT } from "./common";
import { setupNodeVersion } from "./setup";
import { nodeOnlineVersion } from "./node-version";
import { options } from "./options";
import { engineStatus } from "./engine-status";
import { n } from "./n";

export async function commands(keys: any[]) {
    try {
        var option = await nodeOnlineVersion(keys[0])

        if (keys[0]) {
            if (option.data.length > 0) {
                if (option.data.length === 1) {
                    setupNodeVersion(option.message)
                } else {
                    process.stdout.write(option.message);
                }
            } else if (option.message === MSG_NODE_VERSION_NOT_FOULT) {
                process.stdout.write(option.message);
            } else if (option.message === MSG_NODE_NOT_VERSION_TYPE) {
                let option = await options(keys[0])
                if (option) {

                    process.stdout.write(option);
                } else {
                    n(keys)
                }

            }
        } else {
            let status = await engineStatus()
            process.stdout.write(status);

        }
    } catch (err) {
        process.stdout.write(`${err}`);

    }

}
