import fs from 'fs';
import { MSG_NODE_VERSION_NOT_FOULT, MSG_NODE_NOT_VERSION_TYPE, DIR_PATH_HOME_DOT_N_VERSION_FOLDER } from "./common";
import { nodeListVersion } from "./services";
import { NodeVersionType } from "./types";

export async function nodeOnlineVersion(name?: string | null | undefined) {
    try {
        const listVersion: Array<NodeVersionType> = await nodeListVersion();
        const numberRegex = /^\d+$/;

        if (!name) {
            const nameVersions = listVersion.map(val => val.version);
            return {
                message: nameVersions.join("\n"),
                data: listVersion
            };
        }

        if (name === "latest") {
            return listVersion[0].version;
        }

        if (name === "lts") {
            const dataVersions = listVersion.filter(val => typeof val.lts === "string");
            return {
                message: dataVersions[0].version,
                data: [dataVersions[0]]
            };
        }

        if (["argon", "boron", "dubnium", "erbium", "fermium", "gallium", "hydrogen", "iron"].includes(name)) {
            const dataVersions = listVersion.filter(val => typeof val.lts === "string" && val.lts.toLowerCase().includes(name));
            return {
                message: dataVersions[0].version,
                data: [dataVersions[0]]
            };
        }

        const newName = name.toLowerCase();
        const strToArr = newName.split("");

        if (numberRegex.test(strToArr[0]) || (strToArr[0] === "v" && numberRegex.test(strToArr[1]))) {
            const versionFilter = (val: NodeVersionType) => val.version.includes(newName);
            const dataVersions = listVersion.filter(versionFilter);

            if (dataVersions.length > 0) {
                return {
                    message: dataVersions[0].version,
                    data: [dataVersions[0]]
                };
            }

            return {
                message: MSG_NODE_VERSION_NOT_FOULT,
                data: []
            };
        }

        return {
            message: MSG_NODE_NOT_VERSION_TYPE,
            data: []
        };

    } catch (err: any) {
        return err;
    }
}

export async function nodeLocalVersion(name?: string | null): Promise<string | undefined> {
    try {
        const files = fs.readdirSync(DIR_PATH_HOME_DOT_N_VERSION_FOLDER, { withFileTypes: true });
        const versions = files.filter(file => file.isDirectory()).map(file => file.name);

        if (name) {
            return versions.find(val => val === name);
        } else {
            return versions.join("\n");
        }
    } catch (err) {
        return "";
    }
}