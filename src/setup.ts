import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { downloadAndUnzip } from './download';
import { arch, DIR_PATH_HOME_DOT_N_DOT_NRC_FILE, DIR_PATH_HOME_DOT_N_FOLDER, DIR_PATH_HOME_DOT_N_VERSION_FOLDER, NODE_DOWNLOAD_MIRROR_URI, platform } from './common';


export async function setupNodeVersion(name: string) {
    const url = `${NODE_DOWNLOAD_MIRROR_URI}/release/${name}/node-${name}-${platform}-${arch}.${os.platform() === "win32" ? "zip" :"tar.xz"}`
    const filePath = path.basename(url);
    const outputDir = path.join(DIR_PATH_HOME_DOT_N_VERSION_FOLDER, name);
    const outputDownloadDir = path.join(DIR_PATH_HOME_DOT_N_VERSION_FOLDER, filePath);
    const statusDir = await validateDir()

    if (statusDir) {

        let statusDirVersion = await validateDirVersion(DIR_PATH_HOME_DOT_N_VERSION_FOLDER)
        if (statusDirVersion) {
            let statusOutputDir = await validateDirVersion(outputDir)
            if (statusOutputDir) {
                setupFileDotNRC(name)
            } else {
                let download = await downloadAndUnzip(url, outputDownloadDir, DIR_PATH_HOME_DOT_N_VERSION_FOLDER,name)
                if (download) setupFileDotNRC(name)
            }
        }


    } else {
        let status: boolean
        status = await setupFloderDotN()
        if (status) {
            status = await setupFileDotNRC("")
            status = await setupFloderDotNVersion()

            if (status) {

                let download = await downloadAndUnzip(url, filePath, DIR_PATH_HOME_DOT_N_VERSION_FOLDER,name)
                if (download) setupFileDotNRC(name)

            }
        }
    }

}

async function setupFloderDotN() {
    try {
        fs.mkdirSync(DIR_PATH_HOME_DOT_N_FOLDER, { recursive: true });
        // console.log('โฟลเดอร์ถูกสร้างเรียบร้อยแล้ว!');
        return true
    } catch (err) {
        // console.error('เกิดข้อผิดพลาดในการสร้างโฟลเดอร์:', err);
        return false
    }
}

async function setupFloderDotNVersion() {
    try {
        fs.mkdirSync(DIR_PATH_HOME_DOT_N_VERSION_FOLDER, { recursive: true });
        // console.log('โฟลเดอร์ถูกสร้างเรียบร้อยแล้ว!');
        return true
    } catch (err) {
        // console.error('เกิดข้อผิดพลาดในการสร้างโฟลเดอร์:', err);
        return false
    }
}

async function setupFileDotNRC(fileContent: string) {
    try {
        fs.writeFileSync(DIR_PATH_HOME_DOT_N_DOT_NRC_FILE, fileContent);
        console.log(fileContent);
        // console.log('ไฟล์ถูกสร้างเรียบร้อยแล้ว!');
        
        return true
    } catch (err) {
        // console.error('เกิดข้อผิดพลาดในการสร้างไฟล์:', err);
        return false
    }
}

async function validateDir() {
    try {
        const files = fs.readdirSync(DIR_PATH_HOME_DOT_N_FOLDER, { withFileTypes: true });
        // console.log('รายการโฟลเดอร์:');
        files.forEach((file) => {
            if (file.isDirectory()) {
                // console.log(file.name);
            }
        });

        return true

    } catch (err) {
        // console.error('ไม่สามารถอ่านไดเร็กทอรีได้:', err);
        return false
        let status: boolean
        status = await setupFloderDotN()
        if (status) {
            status = await setupFileDotNRC("")
            status = await setupFloderDotNVersion()

        }

        return status
    }

}

async function validateDirVersion(directoryPathName: string) {
    try {
        const files = fs.readdirSync(directoryPathName, { withFileTypes: true });
        // console.log('รายการโฟลเดอร์:');
        files.forEach((file) => {
            if (file.isDirectory()) {
                // console.log(file.name);
            }
        });

        return true

    } catch (err) {
        // console.error('ไม่สามารถอ่านไดเร็กทอรีได้:', err);
        return false
    }

}

