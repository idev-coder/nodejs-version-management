import * as fs from 'fs';
import https from 'https'
import progressStream from 'progress-stream';
import path from 'path'
import { arch, DIR_PATH_HOME_DOT_N_VERSION_FOLDER, platform } from './common';
import { execFileSync } from 'child_process';
import { updateEnvironmentVariables } from './update';
import { loading } from 'cli-loading-animation'
import readline from 'readline'
import binScripts from './bin-scripts';


// ฟังก์ชันสำหรับดาวน์โหลดไฟล์พร้อมแสดงเปอร์เซ็นต์การโหลด
export async function downloadFile(url: string, outputLocationPath: string,name?:string) {
    const { start, stop } = loading(`Downloads ${name}..`);
    start()
    return new Promise((res, rej) => {
        const fileStream = fs.createWriteStream(outputLocationPath);
        // Create a progress stream
        const progress: any = progressStream({
            length: 0, // Placeholder for total length
            time: 1000  // Update progress every second
        });

        // Handle progress events


        https.get(url, (response) => {
            // Set the length of the progress stream to the size of the file (if known)
            progress.length = parseInt(response.headers['content-length'] || '0', 10);

            response.pipe(progress).pipe(fileStream);

            fileStream.on('finish', () => {

                fileStream.close(() => {
                    res(100)
                    stop()
                    process.stdout.write(`[✓] Download ${name}\n`);
                });
            });
        }).on('error', (err) => { // Handle errors
            fs.unlinkSync(outputLocationPath); // Delete the file if there's an error

            rej(err)
            stop()
        });
    })
}

// ฟังก์ชันสำหรับแตกไฟล์

/**
 * Asynchronously attempts to delete a file at the given path.
 * @param filePath - The path to the file to be deleted.
 * @returns A promise that resolves to true if the file is successfully deleted, or rejects with an error.
 */
async function tryDeleteFile(filePath: string): Promise<boolean> {
    try {

        await fs.unlinkSync(filePath);
        return true;
    } catch (error) {
        throw error;
    }
}

async function tryRename(oldPath: string, newPath: string) {
    try {
        await fs.renameSync(oldPath, newPath)
        return true
    } catch (error) {
        throw error;
    }
}

async function trySetup(version: string) {
    return new Promise((res, rej) => {
        const destinationFolder = path.join(DIR_PATH_HOME_DOT_N_VERSION_FOLDER, version)
        let results: any[] = [];

        // อ่านไฟล์ในโฟลเดอร์ต้นทาง
        binScripts.forEach(file => {
            const destFile = path.join(destinationFolder, file.name);
            results.push(destFile)
            fs.writeFileSync(destFile, file.script)
        })

        res(results)
        process.stdout.write("[✓] Setup\n");
    })



}

async function tryInstall(path: string): Promise<boolean | any> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      process.stdout.write("[..] Install Package\n")
    return new Promise((res, rej) => {
        const npmInit = execFileSync('npm', ['init', '-y'], {
            cwd: path,
            stdio: 'pipe',
            encoding: 'utf8',
            shell: true
        });


        const npmInstall = execFileSync('npm', ['install', '-S', '@idev-coder/n', 'pnpm', 'yarn', 'bun'], {
            cwd: path,
            stdio: ['pipe', 'pipe', process.stderr],
            encoding: 'utf8',
            shell: true
        });

        if (npmInit && npmInstall) {
            res(true)
            readline.moveCursor(process.stdout, 0, -1)
            readline.clearLine(process.stdout, 0);  // 0 หมายถึงเคลียร์บรรทัดปัจจุบัน
            process.stdout.write("[✓] Install Package\n");
            rl.close()
        }
    })

}

export async function extractTarXZ(filePath: string, extractToPath: string, version: string) {

    return new Promise(async (res, rej) => {

        if (fs.existsSync(filePath)) {
            
            execFileSync(`tar`, ['-xf', filePath, '-C', extractToPath], {
                stdio: ['pipe', 'pipe', process.stderr],
                encoding: 'utf8',
                shell: true
            });
          
            const oldPath = path.join(extractToPath, `node-${version}-${platform}-${arch}`);
            const newPath = path.join(extractToPath, `${version}`);
            const del = await tryDeleteFile(filePath)
            if (del) {
                let rename = await tryRename(oldPath, newPath)
                if (rename) {
                    process.stdout.write("[✓] Extract\n");

                    let setup: any = await trySetup(version)
                    if (setup.length > 0) {
                        let updateEnv: any = await updateEnvironmentVariables(version)
                        if (updateEnv.length > 0) {
                            const install = await tryInstall(path.join(DIR_PATH_HOME_DOT_N_VERSION_FOLDER, version))
                            res(install)
                        }
                    }


                }
            }


        } else {
            rej(filePath)
            console.error('ไม่พบ:', filePath);

        }
    })

}

// ดาวน์โหลดและแตกไฟล์
export async function downloadAndUnzip(url: string, filePath: string, outputDir: string, version: string,name?:string) {
    try {
        const res = await downloadFile(url, filePath,name);

        if (res === 100) {
            let ex = await extractTarXZ(filePath, outputDir, version);
            if (ex) {
                return true
            }
        }

    } catch (error) {
        console.error('เกิดข้อผิดพลาด:', error);
        return error
    }
}