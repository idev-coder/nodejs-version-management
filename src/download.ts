import * as fs from 'fs';
import https from 'https'
import progressStream from 'progress-stream';
import path from 'path'
import { arch, platform } from './common';
import readline from 'readline'
import { spawn } from 'child_process';


const spinnerFrames = ['|', '/', '-', '\\'];
let currentFrame = 0;

function showSpinner() {
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(spinnerFrames[currentFrame]);
    currentFrame = (currentFrame + 1) % spinnerFrames.length;
}

// ฟังก์ชันสำหรับดาวน์โหลดไฟล์พร้อมแสดงเปอร์เซ็นต์การโหลด
export async function downloadFile(url: string, outputLocationPath: string) {
    return new Promise((res, rej) => {
        const fileStream = fs.createWriteStream(outputLocationPath);
        const interval = setInterval(showSpinner, 100); // Adjust speed here
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
                clearInterval(interval);
                readline.cursorTo(process.stdout, 0);
                fileStream.close(() => {
                    res(100)
                    // if (cb) cb(undefined, 100); // Call callback with 100% progress when done
                });
            });
        }).on('error', (err) => { // Handle errors
            fs.unlinkSync(outputLocationPath); // Delete the file if there's an error
            // if (cb) cb(err.message);
            rej(err)
        });
    })
}

// ฟังก์ชันสำหรับแตกไฟล์

function tryDeleteFile(filePath: string, retries = 5, delay = 1000) {
    fs.unlink(filePath, (err) => {
        if (err) {
            if (retries > 0 && err.code === 'EBUSY') {
                // console.log('File is busy, retrying...');
                setTimeout(() => tryDeleteFile(filePath, retries - 1, delay), delay);
            } else {
                // console.error('Error removing file:', err);
            }
        } else {
            // console.log('File removed successfully.');
        }
    });
}

function tryRename(oldPath: string, newPath: string, retries = 5, delay = 1000) {
    fs.rename(oldPath, newPath, (err) => {
        if (err) {
            if (retries > 0 && (err.code === 'EPERM' || err.code === 'EBUSY')) {
                // console.log('File is busy or permission error, retrying...');
                setTimeout(() => tryRename(oldPath, newPath, retries - 1, delay), delay);
            } else {
                // console.error('Error renaming file:', err);
            }
        } else {
            // console.log('File renamed successfully.');
        }
    });
}

export function extractTarXZ(filePath: string, extractToPath: string, version: string) {


    const interval = setInterval(showSpinner, 100); // Adjust speed here

    if (fs.existsSync(filePath)) {
        const ls = spawn(`tar`, ['-xf', filePath, '-C', extractToPath], {
            stdio: ['pipe', 'pipe', process.stderr],
            shell: true
        });

        ls.stdout.on('data', (data) => {
            // console.log(data);
            process.stdout.write(`${data}`);
        })
        ls.on('close', (code) => {
            // process.stdout.write(`child process close all stdio with code ${code}`);
            const oldPath = path.join(extractToPath, `node-${version}-${platform}-${arch}`);
            const newPath = path.join(extractToPath, `${version}`);
            tryDeleteFile(filePath)
            tryRename(oldPath, newPath)

            clearInterval(interval);
            readline.cursorTo(process.stdout, 0);
            process.stdout.write('Done!\n');
        });

        ls.on('exit', (code) => {
            // process.stdout.write(`child process exited with code ${code}`);

        });



    } else {
        console.error('ไม่พบ:', filePath);
    }
    ;
}

// ดาวน์โหลดและแตกไฟล์
export async function downloadAndUnzip(url: string, filePath: string, outputDir: string, version: string) {
    try {
        console.log('กำลังดาวน์โหลดไฟล์...');

        const res = await downloadFile(url, filePath);

        if (res === 100) {
            extractTarXZ(filePath, outputDir, version);
        }

    } catch (error) {
        console.error('เกิดข้อผิดพลาด:', error);
        return false
    }
}
