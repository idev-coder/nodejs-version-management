import * as fs from 'fs';
import { DIR_PATH_HOME_DOT_N_DOT_NRC_FILE, DIR_PATH_HOME_DOT_N_VERSION_FOLDER, DIR_PATH_PROJECT_DOT_NODE_VERSION_FILE, DIR_PATH_PROJECT_DOT_NRC_FILE, DIR_PATH_PROJECT_DOT_NVMRC_FILE, DIR_PATH_PROJECT_PACKAGE_JSON_FILE, MSG_REMOVE_NODE_VERSION_SUCCESS } from './common';

/**
 * Reads the contents of a file at the given directory path.
 * @param directoryPath - The path to the file to be read.
 * @returns The file content as a string, or an empty string if an error occurs.
 */
export function readFileSystem(directoryPath: string): string {
    try {
        return fs.readFileSync(directoryPath, 'utf8');
    } catch {
        return "";
    }
}

export async function readNodeVersion(): Promise<string | Error> {
    try {
        const filesToCheck = [
            DIR_PATH_PROJECT_DOT_NRC_FILE,
            DIR_PATH_PROJECT_DOT_NVMRC_FILE,
            DIR_PATH_PROJECT_DOT_NODE_VERSION_FILE
        ];

        for (const filePath of filesToCheck) {
            const version = await readFileSystem(filePath);
            if (version) return version;
        }

        const pkgStr = await readFileSystem(DIR_PATH_PROJECT_PACKAGE_JSON_FILE);
        if (pkgStr) {
            const pkg = JSON.parse(pkgStr);
            if (pkg.engines?.node) return pkg.engines.node;
        }

        return await readFileSystem(DIR_PATH_HOME_DOT_N_DOT_NRC_FILE);
    } catch (err:any) {
        return err;
    }
}



export async function removeNodeVersion(version: string) {
    try {
        const files = fs.readdirSync(DIR_PATH_HOME_DOT_N_VERSION_FOLDER, { withFileTypes: true });
        const versions = files
            .filter(file => file.isDirectory())
            .map(file => file.name);

        const groupVersions = versions.filter(val => val.includes(version));

        if (groupVersions.length > 0) {
            fs.rmSync(`${DIR_PATH_HOME_DOT_N_VERSION_FOLDER}/${groupVersions[0]}`, { recursive: true, force: true });
            return MSG_REMOVE_NODE_VERSION_SUCCESS(groupVersions[0]);
        } else {
            throw new Error('Version not found');
        }
    } catch (err) {
        return err;
    }
}