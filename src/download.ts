import * as fs from 'fs';
import tar from 'tar'
import * as os from 'os'
import https from 'https'
import progressStream from 'progress-stream';
import path from 'path'
import Seven from 'node-7z'
import { arch, platform } from './common';
import readline from 'readline'



// ฟังก์ชันสำหรับดาวน์โหลดไฟล์พร้อมแสดงเปอร์เซ็นต์การโหลด
export async function downloadFile(url: string, outputLocationPath: string, cb: (err?: string, progress?: number) => void) {
    const fileStream = fs.createWriteStream(outputLocationPath);

    // Create a progress stream
    const progress: any = progressStream({
        length: 0, // Placeholder for total length
        time: 1000  // Update progress every second
    });

    // Handle progress events
    progress.on('progress', (progress: any) => {
        if (cb) {
            // Calculate and pass percentage to callback
            const percentage = Math.round(progress.percentage);

            cb(undefined, percentage);
        }
    });

    https.get(url, (response) => {
        // Set the length of the progress stream to the size of the file (if known)
        progress.length = parseInt(response.headers['content-length'] || '0', 10);

        response.pipe(progress).pipe(fileStream);

        fileStream.on('finish', () => {
            fileStream.close(() => {
                if (cb) cb(undefined, 100); // Call callback with 100% progress when done
            });
        });
    }).on('error', (err) => { // Handle errors
        fs.unlinkSync(outputLocationPath); // Delete the file if there's an error
        if (cb) cb(err.message);
    });
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

function tryRename(oldPath:string, newPath:string, retries = 5, delay = 1000) {
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



export function extractZip(filePath: string, extractToPath: string, version: string) {
    if (fs.existsSync(filePath)) {
        const totalSteps = 100;
        const myStream = Seven.extractFull(filePath, extractToPath, {
            $progress: true
        })
        myStream.on('data', function (data) {
            // doStuffWith(data) //? { status: 'extracted', file: 'extracted/file.txt" }
            // console.log(data);

        })

        myStream.on('progress', function (val) {

            // doStuffWith(progress) //? { percent: 67, fileCount: 5, file: undefinded }
            const progress = Math.floor((val.percent / totalSteps) * 100);
            const filledLength = Math.max(0, Math.min(val.percent, totalSteps)); // ตรวจสอบว่า filledLength ไม่เกินขอบเขต
            const unfilledLength = Math.max(0, totalSteps - filledLength); // ตรวจสอบว่า unfilledLength ไม่เป็นค่าลบ

            const bar = '='.repeat(filledLength) + ' '.repeat(unfilledLength);
            readline.cursorTo(process.stdout, 0);
            process.stdout.write(`[${bar}] ${progress}%`);
        })

        myStream.on('end', function () {
            // end of the operation, get the number of folders involved in the operation

       
            const oldPath = path.join(extractToPath, `node-${version}-${platform}-${arch}`);
            const newPath = path.join(extractToPath, `${version}`);
            tryDeleteFile(filePath)
            tryRename(oldPath,newPath)

          
        })

        myStream.on('error', (err) => { })
    } else {
        console.error('ไฟล์ zip ไม่พบ:', filePath);
    }

}

export function extractTarXZ(filePath: string, extractToPath: string, version: string) {
    return tar.x({
        file: filePath,
        cwd: extractToPath,
    });
}

// ดาวน์โหลดและแตกไฟล์
export async function downloadAndUnzip(url: string, filePath: string, outputDir: string, version: string) {
    try {
        console.log('กำลังดาวน์โหลดไฟล์...');

        downloadFile(url, filePath, (err: any, res: any) => {
            if (res === 100) {
                if (os.platform() === "win32") {
                    extractZip(filePath, outputDir, version);
                } else {
                    extractTarXZ(filePath, outputDir, version);
                }

                // console.log('ไฟล์ถูกแตกออกใน:', outputDir);
                return true
            }
        });

    } catch (error) {
        console.error('เกิดข้อผิดพลาด:', error);
        return false
    }
}
