import * as fs from 'fs'
import { DIR_PATH_HOME_DOT_N_DOT_NRC_FILE, DIR_PATH_HOME_DOT_N_VERSION_FOLDER, DIR_PATH_PROJECT_DOT_NODE_VERSION_FILE, DIR_PATH_PROJECT_DOT_NRC_FILE, DIR_PATH_PROJECT_DOT_NVMRC_FILE, DIR_PATH_PROJECT_PACKAGE_JSON_FILE, MSG_REMOVE_NODE_VERSION_SUCCESS } from './common';
import readline from 'readline'

export function readFileSystem(directoryPath: string) {
    try {
        const data: string = fs.readFileSync(directoryPath, 'utf8');
        return data
    } catch (err) {
        return ""
    }
}

export async function readNodeVersion() {


    try {
        var version: string
        var pkg: any
        version = await readFileSystem(DIR_PATH_PROJECT_DOT_NRC_FILE)
        version = await readFileSystem(DIR_PATH_PROJECT_DOT_NVMRC_FILE)
        version = await readFileSystem(DIR_PATH_PROJECT_DOT_NODE_VERSION_FILE)

        if (version) {
            return version
        } else {
            let pkgStr: string = await readFileSystem(DIR_PATH_PROJECT_PACKAGE_JSON_FILE)
            if (pkgStr) {
                pkg = JSON.parse(pkgStr)

                if (pkg.engines && pkg.engines.node) {

                    return pkg.engines.node
                } else {
                    version = await readFileSystem(DIR_PATH_HOME_DOT_N_DOT_NRC_FILE)
                    return version
                }
            } else { 
                version = await readFileSystem(DIR_PATH_HOME_DOT_N_DOT_NRC_FILE)
                    return version
            }

        }
    } catch (err) {
        return err
    }

}



export async function removeNodeVersion(version: string) {
    try {

        const files = fs.readdirSync(DIR_PATH_HOME_DOT_N_VERSION_FOLDER, { withFileTypes: true });
        // console.log('รายการโฟลเดอร์:');
        const versions: any[] = []

        files.forEach((file) => {
            if (file.isDirectory()) {
                // console.log(file.name);
                versions.push(file.name)
            }
        });

        let groupVersions = versions.filter((val: string) => val.includes(version))


        // ลบโฟลเดอร์และเนื้อหาภายใน (recursive)
        fs.rmSync(`${DIR_PATH_HOME_DOT_N_VERSION_FOLDER}/${groupVersions[0]}`, { recursive: true, force: true });
        // console.log('โฟลเดอร์ถูกลบเรียบร้อยแล้ว!');
        return MSG_REMOVE_NODE_VERSION_SUCCESS(groupVersions[0])
    } catch (err) {
        // console.error('เกิดข้อผิดพลาดในการลบโฟลเดอร์:', err);
        return err
    }
}