import * as fs from 'fs';
import https from 'https'
import progressStream from 'progress-stream';
import path from 'path'
import { arch, platform } from './common';
import readline from 'readline'
import { spawn } from 'child_process';


const spinnerFrames = ['|', '/', '-', '\\'];
let currentFrame = 0;

function showSpinner(): void {
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(spinnerFrames[currentFrame]);
    currentFrame = (currentFrame + 1) % spinnerFrames.length;
}

// ฟังก์ชันสำหรับดาวน์โหลดไฟล์พร้อมแสดงเปอร์เซ็นต์การโหลด
export async function downloadFile(url: string, outputLocationPath: string): Promise<number> {
    return new Promise((resolve, reject) => {
        const fileStream = fs.createWriteStream(outputLocationPath);
        const interval = setInterval(showSpinner, 100); // Adjust speed here

        const progress:any = progressStream({
            length: 0, // Placeholder for total length
            time: 1000  // Update progress every second
        });

        https.get(url, (response) => {
            progress.length = parseInt(response.headers['content-length'] || '0', 10);
            response.pipe(progress).pipe(fileStream);

            fileStream.on('finish', () => {
                clearInterval(interval);
                readline.cursorTo(process.stdout, 0);
                fileStream.close(() => resolve(100));
            });
        }).on('error', (err) => {
            fs.unlinkSync(outputLocationPath); // Delete the file if there's an error
            reject(err);
        });
    });
}

// ฟังก์ชันสำหรับแตกไฟล์

function tryDeleteFile(filePath: string, retries = 5, delay = 1000): void {
    fs.unlink(filePath, (err) => {
        if (err) {
            if (retries > 0 && err.code === 'EBUSY') {
                setTimeout(() => tryDeleteFile(filePath, retries - 1, delay), delay);
            } else {
                console.error('Error removing file:', err);
            }
        } else {
            console.log('File removed successfully.');
        }
    });
}

function tryRename(oldPath: string, newPath: string, retries = 5, delay = 1000): void {
    fs.rename(oldPath, newPath, (err:any) => {
        if (!err) {
            // console.log('File renamed successfully.');
            return;
        }

        if (retries > 0 && ['EPERM', 'EBUSY'].includes(err.code)) {
            // console.log('File is busy or permission error, retrying...');
            setTimeout(() => tryRename(oldPath, newPath, retries - 1, delay), delay);
        } else {
            // console.error('Error renaming file:', err);
        }
    });
}

export function extractTarXZ(filePath: string, extractToPath: string, version: string) {
    const interval = setInterval(showSpinner, 100); // Adjust speed here

    if (!fs.existsSync(filePath)) {
        console.error('File not found:', filePath);
        return;
    }

    const ls = spawn('tar', ['-xf', filePath, '-C', extractToPath], {
        stdio: ['pipe', 'pipe', process.stderr],
        shell: true
    });

    ls.stdout.on('data', (data) => process.stdout.write(`${data}`));

    ls.on('close', (code) => {
        const oldPath = path.join(extractToPath, `node-${version}-${platform}-${arch}`);
        const newPath = path.join(extractToPath, version);
        tryDeleteFile(filePath);
        tryRename(oldPath, newPath);

        clearInterval(interval);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write('Done!\n');
    });

    ls.on('exit', (code) => {
        // Handle exit if needed
    });
}

// ดาวน์โหลดและแตกไฟล์
export async function downloadAndUnzip(url: string, filePath: string, outputDir: string, version: string): Promise<boolean> {
    try {
        console.log('Installing...');

        const res = await downloadFile(url, filePath);

        if (res === 100) {
            await extractTarXZ(filePath, outputDir, version);
            return true;
        } else {
            console.error('Download failed with status:', res);
            return false;
        }

    } catch (error) {
        console.error('เกิดข้อผิดพลาด:', error);
        return false;
    }
}
