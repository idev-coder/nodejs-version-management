import * as fs from 'fs';
import { execFileSync } from 'child_process';
import { DIR_PATH_HOME_DOT_N_FOLDER, DIR_PATH_HOME_DOT_N_SETTING_FILE, DIR_PATH_HOME_DOT_N_VERSION_FOLDER, DIR_PATH_HOME_FOLDER } from './common';
import path from 'path';
import { setupFolderDotNVersion, updateFileDotNRC, updateNodeVersion } from './update';
import { spawn } from 'child_process';
const version = "v18.20.5"

export function setup() {
    return new Promise(async (res, rej) => {
        const folderDotN = await setupFolderDotN()

        if (folderDotN) {
            const setting = {
                engine: "node",
                tool: "npm"
            }
            fs.writeFileSync(DIR_PATH_HOME_DOT_N_SETTING_FILE, JSON.stringify(setting, null, "\t"));
            await updateFileDotNRC(version)
            await setupBin()
            execFileSync('setx', ['N_HOME', `"${DIR_PATH_HOME_DOT_N_FOLDER}"`], {
                stdio: ['pipe', 'pipe', process.stderr],
                encoding: 'utf8',
                shell: true
            });

            const pathNode = execFileSync('where', ['node'], {
                stdio: ['pipe', 'pipe', process.stderr],
                encoding: 'utf8',
                shell: true
            });

            const pathNodeArr = pathNode.split("\n")

            if (pathNodeArr.length > 1) {
                const pathArr: any[] = []
                pathNodeArr.forEach((patnNode: string) => {
                    if (patnNode.includes('node.exe')) {
                        pathArr.push(patnNode)
                    }

                });

                if (pathArr.length > 1) {
                    let val = await setNodeSymLink(pathArr[0])
                    if (val) {
                        res(true)
                    }
                } else {
                    let val = await setNodeSymLink(pathArr[0])
                    if (val) {
                        res(true)
                    }
                }

                let val = await setNodeSymLink(pathNodeArr[0])
                if (val) {
                    res(true)
                }
            } else if (pathNodeArr.length === 1) {
                let val = await setNodeSymLink(pathNodeArr[0])
                if (val) {
                    res(true)
                }
            } else {
                let nv = await updateNodeVersion(version)
                if (nv) {
                    let val = await setNodeSymLink(`${path.join(DIR_PATH_HOME_DOT_N_VERSION_FOLDER, version)}`)
                    if (val) {
                        res(true)
                    }
                }

            }
        }

    })


}

function setupBin() {
    return new Promise(async (res, rej) => {

        const child = spawn(`winget`, ['install','DenoLand.Deno'], {
            stdio: ['pipe', 'pipe', process.stderr],
            shell: true
        });

        child.stdout.on('data', (data) => {
            process.stdout.write(data);
        });

        child.on('error', (error: any) => {
            process.stdout.write(error);
        });

        child.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            process.exit(0);
        });

        // const nenoVersion = 'v2.1.2'
        // const name = 'bin'
        // const url = `${DENO_DOWNLOAD_MIRROR_URI}/${nenoVersion}/deno-x86_64-pc-windows-msvc.zip`
        // const filePath = path.basename(url);
        // const outputDir = path.join(DIR_PATH_HOME_DOT_N_FOLDER, name);
        // const outputDownloadDir = path.join(DIR_PATH_HOME_DOT_N_FOLDER, filePath);
        // let statusOutputDir = await validateDirVersion(outputDir)
        // if (!statusOutputDir) {
        //     // let download = await downloadAndUnzip(url, outputDownloadDir, DIR_PATH_HOME_DOT_N_FOLDER, name, 'Bin')
        //     // if (download) {
        //     //     res(true)
        //     // }

        //     const child = spawn(`curl`, ['-L','-o', `${filePath}`, `${url}`], {
        //         stdio: ['pipe', 'pipe', process.stderr],
        //         shell: true
        //     });

        //     child.stdout.on('data', (data) => {
        //         process.stdout.write(data);
        //     });

        //     child.on('error', (error: any) => {
        //         process.stdout.write(error);
        //     });

        //     child.on('close', (code) => {
        //         console.log(`child process exited with code ${code}`);
        //         process.exit(0);
        //     });
        // }

    })

}


function setupFolderDotN() {
    return new Promise(async (res, rej) => {
        const folders = fs.readdirSync(DIR_PATH_HOME_FOLDER);

        if (!folders.includes('.n')) {
            fs.mkdirSync(DIR_PATH_HOME_DOT_N_FOLDER, { recursive: true });

            let foldeDotNVersion = await setupFolderDotNVersion()
            if (foldeDotNVersion) {

                res(true)
            }
        } else {
            let foldeDotNVersion = await setupFolderDotNVersion()
            if (foldeDotNVersion) {

                res(true)
            }
        }
    })

}

function setupEnv() {
    return new Promise(async (res, rej) => {
        const sourceFolder = path.join(__dirname, '../', 'setup.cmd');
        execFileSync(`${sourceFolder}`, {
            stdio: ['pipe', 'pipe', process.stderr],
            encoding: 'utf8',
            shell: true
        });

        res(true)
    })

}

function setNodeSymLink(pathNode: string) {
    return new Promise(async (res, rej) => {
        const pathArr = pathNode.split("\\")
        pathArr.pop()
        const newPath = path.join(...pathArr)

        execFileSync('setx', ['N_SYMLINK', `"${newPath}"`], {
            stdio: ['pipe', 'pipe', process.stderr],
            encoding: 'utf8',
            shell: true
        });

        const val = await setupEnv()
        if (val) {
            res(val)
        }
    })

}
