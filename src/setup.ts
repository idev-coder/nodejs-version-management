import * as fs from 'fs';
import { exec, execFileSync } from 'child_process';
import { DIR_PATH_HOME_DOT_N_FOLDER, DIR_PATH_HOME_DOT_N_SETTING_FILE, DIR_PATH_HOME_DOT_N_VERSION_FOLDER, DIR_PATH_HOME_FOLDER } from './common';
import path from 'path';
import { installNode, setupFolderDotNVersion, updateFileDotNRC } from './update';
import { spawn } from 'child_process';
const version = "v20.18.1"

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
                        let checkNode = await updateNode()
                        if (checkNode) {
                            res(true)
                        } else {
                            let nv = await installNode(version)
                            if (nv) {
                                await setupBin()
                                res(true)
                            }
                        }
                    }
                } else {
                    let val = await setNodeSymLink(pathArr[0])
                    if (val) {
                        let checkNode = await updateNode()
                        if (checkNode) {
                            res(true)
                        } else {
                            let nv = await installNode(version)
                            if (nv) {
                                await setupBin()
                                res(true)
                            }
                        }
                    }
                }

                let val = await setNodeSymLink(pathNodeArr[0])
                if (val) {
                    let checkNode = await updateNode()
                    if (checkNode) {
                        res(true)
                    } else {
                        let nv = await installNode(version)
                        if (nv) {
                            await setupBin()
                            res(true)
                        }
                    }
                }
            } else if (pathNodeArr.length === 1) {
                let val = await setNodeSymLink(pathNodeArr[0])
                if (val) {
                    res(true)
                }
            } else {
                let nv = await installNode(version)
                if (nv) {
                    let val = await setNodeSymLink(`${path.join(DIR_PATH_HOME_DOT_N_VERSION_FOLDER, version)}`)
                    if (val) {
                        await setupBin()
                        res(true)
                    }
                }

            }
        }

    })


}

function updateNode() {
    return new Promise((res, rej) => {
        const folders = fs.readdirSync(DIR_PATH_HOME_DOT_N_VERSION_FOLDER);

        if (folders.length > 0) {
            res(true)
        } else {
            res(false)
        }
    })
}

function setupBin() {
    return new Promise(async (res, rej) => {

        const child = spawn(`winget`, ['install', 'DenoLand.Deno'], {
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
            process.exit(0);
        });

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

const batchScript = `
@echo off
for /f "skip=2 tokens=2,*" %%A in ('reg query "HKLM\\System\\CurrentControlSet\\Control\\Session Manager\\Environment" /v Path 2^>nul') do (
  setx PATH "%%B;%%N_HOME%%;%%N_SYMLINK%%"
)
@echo on
`;

function setupEnv() {
    return new Promise(async (res, rej) => {
        exec(batchScript, (error, stdout, stderr) => {
            if (error) {
                process.stdout.write(stderr);
                return;
            }
            if (stderr) {
                process.stdout.write(stderr);
                return;
            }
            process.stdout.write(stdout);
            res(true)
        });


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
