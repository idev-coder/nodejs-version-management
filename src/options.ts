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
        } else if (['access', 'adduser', 'audit', 'bugs', 'cache', 'ci', 'completion',
            'config', 'dedupe', 'deprecate', 'diff', 'dt', 'dist-tag', 'docs', 'doctor',
            'edit', 'exec', 'explain', 'explore', 'fd', 'find-dupes', 'fund', 'get',
            'hs', 'help-search', 'hook', 'init', 'ict', 'install-ci-test', 'it',
            'install-test', 'link', 'll', 'login', 'logout', 'org', 'outdated',
            'owner', 'pack', 'ping', 'pkg', 'prefix', 'profile', 'prune', 'publish',
            'query', 'rebuild', 'repo', 'restart', 'root', 'rs', 'run-script', 'sbom',
            'search', 'set', 'shrinkwrap', 'star', 'stars', 'stop', 'team',
            'token', 'unpublish', 'unstar', 'u', 'update',
            'view', 'whoami'].includes(key)) {
            if (['u', 'update'].includes(key)) {
                if (opts.length > 0) {
                    npm(["update", ...opts])
                } else {
                    npm(["update"])
                }
            } else if (['ict', 'install-ci-test'].includes(key)) {
                if (opts.length > 0) {
                    npm(["install-ci-test", ...opts])
                } else {
                    npm(["install-ci-test"])
                }
            } else if (['it', 'install-test'].includes(key)) {
                if (opts.length > 0) {
                    npm(["install-test", ...opts])
                } else {
                    npm(["install-test"])
                }
            } else if (['hs', 'help-search'].includes(key)) {
                if (opts.length > 0) {
                    npm(["help-search", ...opts])
                } else {
                    npm(["help-search"])
                }
            } else if (['rs', 'run-script'].includes(key)) {
                if (opts.length > 0) {
                    npm(["run-script", ...opts])
                } else {
                    npm(["run-script"])
                }
            } else if (['dt', 'dist-tag'].includes(key)) {
                if (opts.length > 0) {
                    npm(["dist-tag", ...opts])
                } else {
                    npm(["dist-tag"])
                }
            } else if (['fd', 'find-dupes'].includes(key)) {
                if (opts.length > 0) {
                    npm(["find-dupes", ...opts])
                } else {
                    npm(["find-dupes"])
                }
            } else {

                npm(opts)
            }
        } else if (["un", "rm", "del", "uninstall", "remove", "delete"].includes(key)) {
            if (opts[0]) {
                let option = await nodeOnlineVersion(opts[0])
                if (option.data.length === 1) {
                   return removeNodeVersion(opts[0])

                } else {
                    npm(["uninstall", ...opts])
                }
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