import fs from 'fs'
import path from 'path'
import { DIR_PATH_HOME_DOT_N_VERSION_FOLDER, DIR_PATH_PROJECT_PACKAGE_JSON_FILE } from './common';
import { installNode, validateDirVersion } from './update';

export function scriptNames(): any {
    return Object.keys(pkg().scripts)
}

export function engineNames(): any {
    if (pkg().engines) {
        return Object.keys(pkg().engines)
    }
}

export default function pkg(): any {
    if (DIR_PATH_PROJECT_PACKAGE_JSON_FILE) {
        const packageJson: any = JSON.parse(fs.readFileSync(DIR_PATH_PROJECT_PACKAGE_JSON_FILE, 'utf8'))
        return packageJson

    }

}
