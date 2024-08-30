const fs = require('fs')
const os = require('os')
const path = require('path')
const readline = require('readline')
const { spawn, execFileSync } = require('child_process')
const progressStream = require('progress-stream')
const https = require('https')

const version = "v18.20.4"
const platform = os.platform() === "win32" ? "win" : os.platform()
const arch = os.arch()
const DIR_PATH_HOME_FOLDER = os.homedir()
const DIR_PATH_HOME_DOT_N_FOLDER = path.join(DIR_PATH_HOME_FOLDER, 'n-test');
const DIR_PATH_HOME_BIN = path.join(DIR_PATH_HOME_DOT_N_FOLDER, "bin");
const DIR_PATH_HOME_NPM = path.join(DIR_PATH_HOME_BIN, "npm");

function runCommand(command, args, cwd) {
    return new Promise((resolve, reject) => {
        const process = spawn(command, args, { cwd, stdio: 'inherit', shell: true });

        process.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Process exited with code ${code}`));
            }
        });

        process.on('error', (err) => {
            reject(err);
        });
    });
}

async function setupProject() {
    try {
        await runCommand(DIR_PATH_HOME_NPM, ['init', '-y'], DIR_PATH_HOME_DOT_N_FOLDER);

        await runCommand(DIR_PATH_HOME_NPM, ['install', '@idev-coder/n'], DIR_PATH_HOME_DOT_N_FOLDER);

    } catch (error) {
        console.error('Error during setup:', error);
    }
}

async function install() {
    const url = `https://nodejs.org/download/release/${version}/node-${version}-${platform}-${arch}.${os.platform() === "win32" ? "zip" : "tar.xz"}`
    const filePath = path.basename(url);
    const outputDir = path.join(DIR_PATH_HOME_DOT_N_FOLDER, version);
    const outputDownloadDir = path.join(DIR_PATH_HOME_DOT_N_FOLDER, filePath);

    let statusDirVersion = await validateDirVersion(DIR_PATH_HOME_DOT_N_FOLDER)
    if (statusDirVersion) {
        let statusOutputDir = await validateDirVersion(outputDir)
        if (!statusOutputDir) {
            downloadAndUnzip(url, outputDownloadDir, DIR_PATH_HOME_DOT_N_FOLDER, version)
        }
    } else {
        let status
        status = await setupFloderDotN(DIR_PATH_HOME_DOT_N_FOLDER)

        if (status) {

            downloadAndUnzip(url, filePath, DIR_PATH_HOME_DOT_N_FOLDER, version)

        }
    }
}

async function setupFloderDotN(pathName) {
    try {
        fs.mkdirSync(pathName, { recursive: true });
        return true
    } catch (err) {
        return false
    }
}

async function validateDirVersion(directoryPathName) {
    try {
        const files = fs.readdirSync(directoryPathName, { withFileTypes: true });
        files.forEach((file) => {
            if (file.isDirectory()) {
            }
        });

        return true

    } catch (err) {
        return false
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
    return new Promise((res, rej) => {
        const fileStream = fs.createWriteStream(outputLocationPath);
        const interval = setInterval(showSpinner, 100); // Adjust speed here
        // Create a progress stream
        const progress = progressStream({
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

function tryDeleteFile(filePath, retries = 5, delay = 1000) {
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

function tryRename(oldPath, newPath, retries = 5, delay = 1000) {
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

function extractTarXZ(filePath, extractToPath, version) {


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
            const newPath = path.join(extractToPath, `bin`);
            tryDeleteFile(filePath)
            tryRename(oldPath, newPath)


            validateDirVersion(DIR_PATH_HOME_BIN).then(res => {
                // process.stdout.write('Done!\n');
                setup().then(res => {
                    clearInterval(interval);
                    readline.cursorTo(process.stdout, 0);
                    process.stdout.write(`${res}\n`);
                })

            }).catch(err => {
                process.stdout.write(err);
            })


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
async function downloadAndUnzip(url, filePath, outputDir, version) {
    try {
        console.log('Installing...');

        const res = await downloadFile(url, filePath);

        if (res === 100) {
            extractTarXZ(filePath, outputDir, version);
        }

    } catch (error) {
        console.error('เกิดข้อผิดพลาด:', error);
        return false
    }
}

function setup() {

    return new Promise((res, rej) => {
        try {
            const setx = spawn(`setx`, [`N_HOME`, `${DIR_PATH_HOME_DOT_N_FOLDER}`], {
                stdio: ['pipe', 'pipe', process.stderr],
                shell: true
            });

            const script_bin_sh_n = binScripts('sh')
            const script_bin_pwsh_n = binScripts('pwsh')
            const script_bin_cmd_n = binScripts('cmd')

            fs.writeFileSync(`${DIR_PATH_HOME_DOT_N_FOLDER}\\n`, script_bin_sh_n)
            fs.writeFileSync(`${DIR_PATH_HOME_DOT_N_FOLDER}\\n.ps1`, script_bin_pwsh_n)
            fs.writeFileSync(`${DIR_PATH_HOME_DOT_N_FOLDER}\\n.cmd`, script_bin_cmd_n)


            setx.on('close', (code) => {
                setupProject().then(() => {

                    res("Done!")
                })
            });

        } catch (err) {
            rej(err)
        }


    })

}

function binScripts(type) {

    if (type === "sh") {
        return `#!/usr/bin/env bash
  
  # กำหนดตำแหน่งของไฟล์ node
  NODE_EXE="$PWD/bin/node.exe"
  
  # ตรวจสอบว่าไฟล์ที่กำหนดมีอยู่หรือไม่
  if [ ! -f "$NODE_EXE" ]; then
    NODE_EXE="$PWD/bin/node"
  fi
  if [ ! -f "$NODE_EXE" ]; then
    NODE_EXE="node"
  fi
  
  # กำหนดตำแหน่งของ n-cli.js
  N_CLI_JS="$PWD/node_modules/@idev-coder/n/bin/n-cli.js"
  
  # รัน node กับ n-cli.js และเก็บผลลัพธ์
  N_BIN=$("$NODE_EXE" "$N_CLI_JS" "$@")
  
  if [ -n "$N_BIN" ]; then
      # แยกผลลัพธ์โดยใช้เว้นวรรค
      IFS=' ' read -r -a array <<< "$N_BIN"
      cmd=${"${array[0]}"}
      args=${"${array[@]:1}"
            }
      case "$cmd" in
          *node*)
              "$cmd" $args
              ;;
          *npm*)
              "$cmd" $args
              ;;
          *npx*)
              "$cmd" $args
              ;;
          *)
              echo "$N_BIN"
              ;;
      esac
  else
      # ถ้า $N_BIN ไม่มีค่า
      N_V=$("$NODE_EXE" "$N_CLI_JS" "-v")
      NODE_V=$(node -v)
      NPM_V=$(npm -v)
      NPX_V=$(npx -v)
  
      echo "n $N_V"
      echo "node $NODE_V"
      echo "npm v$NPM_V"
      echo "npx v$NPX_V"
  fi
  `
    } else if (type === "cmd") {
        return `@echo off
  setlocal
  
  rem กำหนดตำแหน่งของไฟล์ node
  set "NODE_EXE=%~dp0\\bin\\node.exe"
  
  rem ตรวจสอบว่าไฟล์ที่กำหนดมีอยู่หรือไม่
  if not exist "%NODE_EXE%" set "NODE_EXE=%~dp0\\bin\\node"
  if not exist "%NODE_EXE%" set "NODE_EXE=node"
  
  rem กำหนดตำแหน่งของ n-cli.js
  set "N_CLI_JS=%~dp0\\node_modules\\@idev-coder\\n\\bin\\n-cli.js"
  
  rem รัน node กับ n-cli.js และเก็บผลลัพธ์
  for /f "delims=" %%i in ('"%NODE_EXE%" "%N_CLI_JS%" %*') do set "N_BIN=%%i"
  
  if defined N_BIN (
      rem แยกผลลัพธ์โดยใช้เว้นวรรค
      for /f "tokens=1,* delims= " %%a in ("%N_BIN%") do (
          set "cmd=%%a"
          set "args=%%b"
      )
  
      rem รันคำสั่งที่เกี่ยวข้อง
      if "%cmd%"=="node" (
          %cmd% %args%
      ) else if "%cmd%"=="npm" (
          %cmd% %args%
      ) else if "%cmd%"=="npx" (
          %cmd% %args%
      ) else (
          echo %N_BIN%
      )
  ) else (
      rem ถ้า %N_BIN% ไม่มีค่า
      for /f "delims=" %%v in ('"%NODE_EXE%" "%N_CLI_JS%" -v') do set "N_V=%%v"
      for /f "delims=" %%v in ('node -v') do set "NODE_V=%%v"
      for /f "delims=" %%v in ('npm -v') do set "NPM_V=%%v"
      for /f "delims=" %%v in ('npx -v') do set "NPX_V=%%v"
      
      echo n %N_V%
      echo node %NODE_V%
      echo npm v%NPM_V%
      echo npx v%NPX_V%
  )
  
  endlocal
  `
    } else if (type === "pwsh") {
        return `#!/usr/bin/env pwsh
  $NODE_EXE="$PSScriptRoot/bin/node.exe"
  
  if (-not (Test-Path $NODE_EXE)) {
    $NODE_EXE="$PSScriptRoot/bin/node"
  }
  if (-not (Test-Path $NODE_EXE)) {
    $NODE_EXE="node"
  }
  
  $N_CLI_JS="$PSScriptRoot/node_modules/@idev-coder/n/bin/n-cli.js"
  
  $N_BIN = & $NODE_EXE $N_CLI_JS $args
  
  if($N_BIN) {
      $array = $N_BIN -split " "
      if($array[0] -like "*node*") {
          $NODE_ARGS = $array[1..($array.Length - 1)]
          $BIN_NODE = $array[0]
          & $BIN_NODE $NODE_ARGS
      }elseif($array[0] -like "*npm*") {
          $NPM_ARGS = $array[1..($array.Length - 1)]
          $BIN_NPM = $array[0]
          & $BIN_NPM $NPM_ARGS
      }elseif($array[0] -like "*npx*") {
          $NPX_ARGS = $array[1..($array.Length - 1)]
          $BIN_NPX = $array[0]
          & $BIN_NPX $NPX_ARGS
      }else {
          Write-Output $N_BIN
      }
  }else {
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
    }
}



install()