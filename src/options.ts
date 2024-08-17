import { MSG_NODE_VERSION_NOT_FOULT, VERSION } from "./common";
import { removeNodeVersion } from "./engine-fs";
import { help } from "./help";
import { n } from "./n";
import { node } from "./node";
import { nodeLocalVersion, nodeOnlineVersion } from "./node-version";
import { npm } from "./npm";
import { npx } from "./npx";
import { setupNodeVersion } from "./setup";

export async function options(key: string) {
    try {

        const opts = process.argv.slice(3)

        if (["v", "version", "-v", "-V", "-version", "--version"].includes(key)) {
            return `v${VERSION}`
        } else if (["h", "help", "-h", "-H", "--help"].includes(key)) {
            return help()
        } else if (["i", "install", "use", "add"].includes(key)) {
            if (opts[0]) {
                let option = await nodeOnlineVersion(opts[0])
                if (option.data.length === 1) {
                    setupNodeVersion(option.message)

                } else {
                    npm(["install", ...opts])
                }
            } else {
                npm(["install"])
            }
        } else if (["un", "rm", "del", "uninstall", "remove", "delete"].includes(key)) {
            if (opts[0]) {
                return removeNodeVersion(opts[0])
            } else {
                return MSG_NODE_VERSION_NOT_FOULT
            }
        } else if (["ls", "list"].includes(key)) {
            if (opts[0]) {
                return nodeLocalVersion(opts[0])
            } else {
                return nodeLocalVersion()
            }
        } else if (["lsr", "list-remote"].includes(key)) {

            if (opts[0]) {
                let nodeVersions = await nodeOnlineVersion(opts[0])
                return nodeVersions.message
            } else {
                let nodeVersions = await nodeOnlineVersion()
                return nodeVersions.message

            }
        } else if (key === "run") {
            n(opts)
        } else if (key === "node") {
            node(opts)
        } else if (key === "npm") {
            npm(opts)
        } else if (key === "npx") {
            npx(opts)
        } else {
            return ""
        }


    } catch (err) {
        return err
    }
}