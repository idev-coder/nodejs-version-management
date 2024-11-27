
import { DIR_PATH_PROJECT_PACKAGE_JSON_FILE, MSG_NODE_VERSION_NOT_FOULT } from "./common"
import { readFileSystem, readNodeVersion } from "./engine-fs"
import { node } from './node'
import { npm } from "./npm"
import { npx } from "./npx"

function pkgScripts(): Record<string, string> | undefined {
    const pkgStr = readFileSystem(DIR_PATH_PROJECT_PACKAGE_JSON_FILE);
    const pkg = JSON.parse(pkgStr);
    return pkg.scripts;
}

export async function n(options: any[]): Promise<any> {
    try {
        const version: any = await readNodeVersion();
        const firstOption: string = options[0];

        if (!version) {
            return MSG_NODE_VERSION_NOT_FOULT;
        }

        if (firstOption.includes(".") || firstOption.includes("/") || firstOption.endsWith(".mjs") || firstOption.endsWith(".js")) {
            return node(options);
        }

        const packageScripts:any = pkgScripts();
        if (packageScripts[firstOption]) {
            return firstOption === "start" ? npm([firstOption]) : npm(["run", firstOption]);
        }

        return npx(options);

    } catch (err: any) {
        return `${err}`;
    }
}