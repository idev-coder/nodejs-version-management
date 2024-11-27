import { MSG_NODE_NOT_VERSION_TYPE, MSG_NODE_VERSION_NOT_FOULT } from "./common";
import { setupNodeVersion } from "./setup";
import { nodeOnlineVersion } from "./node-version";
import { options } from "./options";
import { n } from "./n";

export async function commands(keys: any[]) {
    try {
        if (!keys[0]) {
            console.log("");
            process.exit(0);
        }

        const option = await nodeOnlineVersion(keys[0]);

        if (option.data.length > 0) {
            if (option.data.length === 1) {
                setupNodeVersion(option.message);
            } else {
                console.log(option.message);
                process.exit(0);
            }
        } else if (option.message === MSG_NODE_VERSION_NOT_FOULT) {
            console.log(option.message);
        } else if (option.message === MSG_NODE_NOT_VERSION_TYPE) {
            const option = await options(keys[0]);
            if (option) {
                console.log(option);
                process.exit(0);
            } else {
                const nStr = await n(keys);
                console.log(nStr);
                process.exit(0);
            }
        }
    } catch (err) {
        console.log(`${err}`);
        process.exit(0);
    }
}
