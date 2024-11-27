import { MSG_NODE_VERSION_NOT_FOULT, VERSION } from "./common";
import { removeNodeVersion } from "./engine-fs";
import { help } from "./help";
import { n } from "./n";
import { node } from "./node";
import { nodeLocalVersion, nodeOnlineVersion } from "./node-version";
import { npm } from "./npm";
import { npx } from "./npx";
import {  setupNodeVersion } from "./setup";

export async function options(key: string) {
    try {
        const opts = process.argv.slice(3);

        const versionKeys = ["v", "version", "-v", "-V", "-version", "--version"];
        const helpKeys = ["h", "help", "-h", "-H", "--help"];
        const installKeys = ["i", "install", "use", "add"];
        const uninstallKeys = ["un", "rm", "del", "uninstall", "remove", "delete"];
        const listKeys = ["ls", "list"];
        const listRemoteKeys = ["lsr", "list-remote"];
        const npmCommands = [
            'access', 'adduser', 'audit', 'bugs', 'cache', 'ci', 'completion',
            'config', 'dedupe', 'deprecate', 'diff', 'dt', 'dist-tag', 'docs', 'doctor',
            'edit', 'exec', 'explain', 'explore', 'fd', 'find-dupes', 'fund', 'get',
            'hs', 'help-search', 'hook', 'init', 'ict', 'install-ci-test', 'it',
            'install-test', 'link', 'll', 'login', 'logout', 'org', 'outdated',
            'owner', 'pack', 'ping', 'pkg', 'prefix', 'profile', 'prune', 'publish',
            'query', 'rebuild', 'repo', 'restart', 'root', 'rs', 'run-script', 'sbom',
            'search', 'set', 'shrinkwrap', 'star', 'stars', 'stop', 'team',
            'token', 'unpublish', 'unstar', 'u', 'update',
            'view', 'whoami'
        ];

        if (versionKeys.includes(key)) {
            return `v${VERSION}`;
        } else if (helpKeys.includes(key)) {
            return help();
        } else if (installKeys.includes(key)) {
            if (opts[0]) {
                const option = await nodeOnlineVersion(opts[0]);
                if (option.data.length === 1) {
                    setupNodeVersion(option.message);
                } else {
                    return npm(["install", ...opts]);
                }
            } else {
                return npm(["install"]);
            }
        } else if (npmCommands.includes(key)) {
            const commandMap: { [key: string]: string } = {
                'u': 'update',
                'ict': 'install-ci-test',
                'it': 'install-test',
                'hs': 'help-search',
                'rs': 'run-script',
                'dt': 'dist-tag',
                'fd': 'find-dupes'
            };
            const command = commandMap[key] || key;
            return npm([command, ...opts]);
        } else if (uninstallKeys.includes(key)) {
            if (opts[0]) {
                const option = await nodeOnlineVersion(opts[0]);
                if (option.data.length === 1) {
                    return removeNodeVersion(opts[0]);
                } else {
                    return npm(["uninstall", ...opts]);
                }
            } else {
                return MSG_NODE_VERSION_NOT_FOULT;
            }
        } else if (listKeys.includes(key)) {
            return opts[0] ? nodeLocalVersion(opts[0]) : nodeLocalVersion();
        } else if (listRemoteKeys.includes(key)) {
            const nodeVersions = await nodeOnlineVersion(opts[0]);
            return nodeVersions.message;
        } else if (key === "run") {
            return n(opts);
        } else if (key === "node") {
            return node(opts);
        } else if (key === "npm") {
            return npm(opts);
        } else if (key === "npx") {
            return npx(opts);
        } else {
            return "";
        }
    } catch (err) {
        return `${err}`;
    }
}