const fs = require('fs')
const os = require('os')
const path = require('path')
const readline = require('readline')
const { spawn } = require('child_process')
const progressStream = require('progress-stream')
const https = require('https')

const version = "v18.20.4"
const platform = os.platform() === "win32" ? "win" : os.platform()
const arch = os.arch()
const DIR_PATH_HOME_FOLDER = os.homedir()
const DIR_PATH_HOME_DOT_N_FOLDER = path.join(DIR_PATH_HOME_FOLDER, 'n');
const DIR_PATH_HOME_BIN = path.join(DIR_PATH_HOME_DOT_N_FOLDER, "bin");
const DIR_PATH_HOME_NPM = path.join(DIR_PATH_HOME_BIN, "npm");

async function install() {
    const url = `https://nodejs.org/download/release/${version}/node-${version}-${platform}-${arch}.${os.platform() === "win32" ? "zip" : "tar.xz"}`;
    const filePath = path.basename(url);
    const outputDir = path.join(DIR_PATH_HOME_DOT_N_FOLDER, version);
    const outputDownloadDir = path.join(DIR_PATH_HOME_DOT_N_FOLDER, filePath);

    const statusDirVersion = await validateDirVersion(DIR_PATH_HOME_DOT_N_FOLDER);
    if (statusDirVersion) {
        const statusOutputDir = await validateDirVersion(outputDir);
        if (!statusOutputDir) {
            await downloadAndUnzip(url, outputDownloadDir, DIR_PATH_HOME_DOT_N_FOLDER, version);
        }
    } else {
        const status = await setupFloderDotN(DIR_PATH_HOME_DOT_N_FOLDER);
        if (status) {
            await downloadAndUnzip(url, filePath, DIR_PATH_HOME_DOT_N_FOLDER, version);
        }
    }
}

/**
 * Asynchronously creates a directory at the specified path.
 * @param {string} pathName - The path where the directory should be created.
 * @returns {Promise<boolean>} - Resolves to true if the directory is created successfully, otherwise false.
 */
async function setupFloderDotN(pathName) {
    try {
        fs.mkdirSync(pathName, { recursive: true });
        return true;
    } catch {
        return false;
    }
}

/**
 * Validates if a directory can be read successfully.
 * @param {string} directoryPathName - The path to the directory to be validated.
 * @returns {Promise<boolean>} - Returns true if the directory is read successfully, false if an error occurs.
 */
async function validateDirVersion(directoryPathName) {
    try {
        const files = fs.readdirSync(directoryPathName, { withFileTypes: true });
        files.some(file => file.isDirectory()); // Check for directories, but no action needed
        return true;
    } catch (err) {
        return false;
    }
}

const spinnerFrames = ['|', '/', '-', '\\'];
let currentFrame = 0;

function showSpinner() {
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(spinnerFrames[currentFrame]);
    currentFrame = (currentFrame + 1) % spinnerFrames.length;
}

// ฟังก์ชันสำหรับดาวน์โหลดไฟล์พร้อมแสดงเปอร์เซ็นต์การโหลด
async function downloadFile(url, outputLocationPath) {
    return new Promise((resolve, reject) => {
        const fileStream = fs.createWriteStream(outputLocationPath);
        const interval = setInterval(showSpinner, 100); // Adjust speed here

        const progress = progressStream({
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

function tryDeleteFile(filePath, retries = 5, delay = 1000) {
    fs.unlink(filePath, (err) => {
        if (err && retries > 0 && err.code === 'EBUSY') {
            setTimeout(() => tryDeleteFile(filePath, retries - 1, delay), delay);
        }
    });
}

function tryRename(oldPath, newPath, retries = 5, delay = 1000) {
    fs.rename(oldPath, newPath, (err) => {
        if (err) {
            if (retries > 0 && ['EPERM', 'EBUSY'].includes(err.code)) {
                setTimeout(() => tryRename(oldPath, newPath, retries - 1, delay), delay);
            } else {
                console.error('Error renaming file:', err);
            }
        } else {
            console.log('File renamed successfully.');
        }
    });
}

function extractTarXZ(filePath, extractToPath, version) {
    const interval = setInterval(showSpinner, 100); // Adjust speed here

    if (!fs.existsSync(filePath)) {
        console.error('ไม่พบ:', filePath);
        return;
    }

    const ls = spawn('tar', ['-xf', filePath, '-C', extractToPath], {
        stdio: ['pipe', 'pipe', process.stderr],
        shell: true
    });

    ls.stdout.on('data', (data) => {
        process.stdout.write(`${data}`);
    });

    ls.on('close', async (code) => {
        const oldPath = path.join(extractToPath, `node-${version}-${platform}-${arch}`);
        const newPath = path.join(extractToPath, 'bin');
        tryDeleteFile(filePath);
        tryRename(oldPath, newPath);

        try {
            const res = await validateDirVersion(DIR_PATH_HOME_BIN);
            const setupRes = await setup();
            clearInterval(interval);
            readline.cursorTo(process.stdout, 0);
            process.stdout.write(`${setupRes}\n`);
        } catch (err) {
            process.stdout.write(err);
        }
    });

    ls.on('exit', (code) => {
        // process.stdout.write(`child process exited with code ${code}`);
    });
}

// ดาวน์โหลดและแตกไฟล์
async function downloadAndUnzip(url, filePath, outputDir, version) {
    try {
        console.log('Installing...');

        const res = await downloadFile(url, filePath);

        if (res === 100) {
            await extractTarXZ(filePath, outputDir, version);
        }

    } catch (error) {
        console.error('เกิดข้อผิดพลาด:', error);
        return false;
    }
}




function setup() {
    return new Promise((res, rej) => {
        try {
            const scripts = {
                sh: binScripts('sh'),
                pwsh: binScripts('pwsh'),
                cmd: binScripts('cmd')
            };

            const filePaths = {
                n: `${DIR_PATH_HOME_DOT_N_FOLDER}\\n`,
                nPs1: `${DIR_PATH_HOME_DOT_N_FOLDER}\\n.ps1`,
                nCmd: `${DIR_PATH_HOME_DOT_N_FOLDER}\\n.cmd`,
                setupCmd: `${DIR_PATH_HOME_DOT_N_FOLDER}\\setup.cmd`
            };

            fs.writeFileSync(filePaths.n, scripts.sh);
            fs.writeFileSync(filePaths.nPs1, scripts.pwsh);
            fs.writeFileSync(filePaths.nCmd, scripts.cmd);
            fs.writeFileSync(filePaths.setupCmd, `@echo off
for /f "skip=2 tokens=2,*" %%A in ('reg query "HKLM\\System\\CurrentControlSet\\Control\\Session Manager\\Environment" /v Path 2^>nul') do (
  setx PATH "%%B;%%N_HOME%%;%%N_SYMLINK%%"
)
@echo on
`);

            const spawnOptions = {
                stdio: ['pipe', 'pipe', process.stderr],
                shell: true
            };

            const setupInstall = spawn(filePaths.setupCmd, spawnOptions);
            setupInstall.on('close', () => {
                const initPkg = spawn(DIR_PATH_HOME_NPM, ['init', '-y'], {
                    ...spawnOptions,
                    cwd: DIR_PATH_HOME_DOT_N_FOLDER
                });

                initPkg.on('close', () => {
                    const installPkg = spawn(DIR_PATH_HOME_NPM, ['install', '@idev-coder/n'], {
                        ...spawnOptions,
                        cwd: DIR_PATH_HOME_DOT_N_FOLDER
                    });

                    installPkg.on('close', () => {
                        const setx = spawn('setx', ['N_HOME', DIR_PATH_HOME_DOT_N_FOLDER], spawnOptions);
                        setx.on('close', () => {
                            const setx_n_link = spawn('setx', ['N_SYMLINK', DIR_PATH_HOME_BIN], spawnOptions);
                            setx_n_link.on('close', () => res("Done!"));
                        });
                    });
                });
            });

        } catch (err) {
            rej(err);
        }
    });
}

function binScripts(type) {
    const scripts = {
        sh: `#!/usr/bin/env bash

# Define the node executable
NODE_EXE="$(dirname "$0")/bin/node"

# Check if node.exe exists, otherwise use node
if [[ ! -x "$NODE_EXE" ]]; then
    NODE_EXE="node"
fi

# Define the n-cli.js script
N_CLI_JS="$(dirname "$0")/node_modules/@idev-coder/n/bin/n-cli.js"

# Run the command and capture output
N_BIN=$("$NODE_EXE" "$N_CLI_JS" "$@")

# Check if N_BIN is set and not empty
if [[ -n "$N_BIN" ]]; then
    # Split N_BIN by space and check the command
    CMD=$(echo "$N_BIN" | awk '{print $1}')
    
    if [[ "$CMD" == "node" || "$CMD" == "npm" || "$CMD" == "npx" ]]; then
        eval "$N_BIN"
    else
        echo "$N_BIN"
    fi
else
    # Get version information
    N_V=$("$NODE_EXE" "$N_CLI_JS" -v)
    NODE_V=$(node -v)
    NPM_V=$(npm -v)
    NPX_V=$(npx -v)
    
    # Print version information
    echo "n $N_V"
    echo "node $NODE_V"
    echo "npm v$NPM_V"
    echo "npx v$NPX_V"
fi
`,
        cmd: `@echo off
setlocal

:: Define the node executable
set "NODE_EXE=%~dp0\\bin\\node.exe"

:: Check if node.exe exists, otherwise use node
if not exist "%NODE_EXE%" (
    set "NODE_EXE=node"
)

:: Define the n-cli.js script
set "N_CLI_JS=%~dp0\\node_modules\\@idev-coder\\n\\bin\\n-cli.js"

:: Run the command
set "N_BIN="
for /f "delims=" %%i in ('"%NODE_EXE%" "%N_CLI_JS%" %*') do set "N_BIN=%%i"

:: Check if N_BIN is set and not empty
if defined N_BIN (
    :: Split N_BIN by space and check the command
    for /f "tokens=1" %%a in ("%N_BIN%") do set "CMD=%%a"

    if "%CMD%"=="node" (
        call %N_BIN%
    ) else if "%CMD%"=="npm" (
        call %N_BIN%
    ) else if "%CMD%"=="npx" (
        call %N_BIN%
    ) else (
        echo %N_BIN%
    )
) else (
    :: Get version information
    for /f "delims=" %%v in ('"%NODE_EXE%" "%N_CLI_JS%" -v') do set "N_V=%%v"
    for /f "delims=" %%v in ('node -v') do set "NODE_V=%%v"
    for /f "delims=" %%v in ('npm -v') do set "NPM_V=%%v"
    for /f "delims=" %%v in ('npx -v') do set "NPX_V=%%v"
    
    :: Print version information
    echo n %N_V%
    echo node %NODE_V%
    echo npm v%NPM_V%
    echo npx v%NPX_V%
)

endlocal
`,
        pwsh: `#!/usr/bin/env pwsh
$NODE_EXE="$PSScriptRoot/bin/node.exe"

if (-not (Test-Path $NODE_EXE)) {
    $NODE_EXE="node"
}

$N_CLI_JS="$PSScriptRoot/node_modules/@idev-coder/n/bin/n-cli.js"

$N_BIN = & $NODE_EXE $N_CLI_JS $args

if ($N_BIN) {
    $array = $N_BIN -split " "
    if ($array[0] -eq "node" -or $array[0] -eq "npm" -or $array[0] -eq "npx") {
        Invoke-Expression $N_BIN
    } else {
        Write-Output $N_BIN
    }
} else {
    $N_V = & $NODE_EXE $N_CLI_JS "-v"
    $NODE_V = & "node" "-v"
    $NPM_V = & "npm" "-v"
    $NPX_V = & "npx" "-v"
    Write-Output "n $N_V"
    Write-Output "node $NODE_V"
    Write-Output "npm v$NPM_V"
    Write-Output "npx v$NPX_V"
}
`
    };

    return scripts[type] || '';
}



install()