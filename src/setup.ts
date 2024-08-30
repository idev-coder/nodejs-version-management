import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { downloadAndUnzip } from './download';
import { arch, DIR_PATH_HOME_DOT_N_DOT_NRC_FILE, DIR_PATH_HOME_DOT_N_VERSION_FOLDER, DIR_PATH_HOME_FOLDER, DIR_PATH_PROJECT, NODE_DOWNLOAD_MIRROR_URI, platform } from './common';
import { binScripts } from './bin-scripts';
import { spawn } from 'child_process'

export async function setupNodeVersion(name: string) {
  const url = `${NODE_DOWNLOAD_MIRROR_URI}/release/${name}/node-${name}-${platform}-${arch}.${os.platform() === "win32" ? "zip" : "tar.xz"}`
  const filePath = path.basename(url);

  const outputDir = path.join(DIR_PATH_HOME_DOT_N_VERSION_FOLDER, name);
  const outputDownloadDir = path.join(DIR_PATH_HOME_DOT_N_VERSION_FOLDER, filePath);


  let statusDirVersion = await validateDirVersion(DIR_PATH_HOME_DOT_N_VERSION_FOLDER)
  if (statusDirVersion) {
    let statusOutputDir = await validateDirVersion(outputDir)
    if (statusOutputDir) {
      setupFileDotNRC(name)

    } else {
      setupFileDotNRC(name)
      downloadAndUnzip(url, outputDownloadDir, DIR_PATH_HOME_DOT_N_VERSION_FOLDER, name)
    }
  } else {
    let status: boolean
    status = await setupFileDotNRC("")
    status = await setupFloderDotNVersion()

    if (status) {

      setupFileDotNRC(name)
      downloadAndUnzip(url, filePath, DIR_PATH_HOME_DOT_N_VERSION_FOLDER, name)

    }
  }

}

async function setupFloderDotNVersion() {
  try {
    fs.mkdirSync(DIR_PATH_HOME_DOT_N_VERSION_FOLDER, { recursive: true });
    return true
  } catch (err) {
    return false
  }
}



function updateEnvironmentVariables(newVersion: string) {
  try {

    var newVersionPath: any = `${DIR_PATH_HOME_DOT_N_VERSION_FOLDER}\\${newVersion}`

    const script_bin_sh_npm: any = binScripts(newVersionPath.replaceAll('\\', '/'), 'npm', 'sh')
    const script_bin_cmd_npm: any = binScripts(newVersionPath, 'npm', 'cmd')
    const script_bin_pwsh_npm: any = binScripts(newVersionPath.replaceAll('\\', '/'), 'npm', 'pwsh')

    const script_bin_sh_npx: any = binScripts(newVersionPath.replaceAll('\\', '/'), 'npx', 'sh')
    const script_bin_cmd_npx: any = binScripts(newVersionPath, 'npx', 'cmd')
    const script_bin_pwsh_npx: any = binScripts(newVersionPath.replaceAll('\\', '/'), 'npx', 'pwsh')

    const script_bin_sh_node: any = binScripts(newVersionPath.replaceAll('\\', '/'), 'node', 'sh')
    const script_bin_cmd_node: any = binScripts(newVersionPath, 'node', 'cmd')
    const script_bin_pwsh_node: any = binScripts(newVersionPath.replaceAll('\\', '/'), 'node', 'pwsh')

    fs.writeFileSync(`${DIR_PATH_HOME_FOLDER}\\npm`, script_bin_sh_npm)
    fs.writeFileSync(`${DIR_PATH_HOME_FOLDER}\\npm.cmd`, script_bin_cmd_npm)
    fs.writeFileSync(`${DIR_PATH_HOME_FOLDER}\\npm.ps1`, script_bin_pwsh_npm)

    fs.writeFileSync(`${DIR_PATH_HOME_FOLDER}\\npx`, script_bin_sh_npx)
    fs.writeFileSync(`${DIR_PATH_HOME_FOLDER}\\npx.cmd`, script_bin_cmd_npx)
    fs.writeFileSync(`${DIR_PATH_HOME_FOLDER}\\npx.ps1`, script_bin_pwsh_npx)

    fs.writeFileSync(`${DIR_PATH_HOME_FOLDER}\\node`, script_bin_sh_node)
    fs.writeFileSync(`${DIR_PATH_HOME_FOLDER}\\node.cmd`, script_bin_cmd_node)
    fs.writeFileSync(`${DIR_PATH_HOME_FOLDER}\\node.ps1`, script_bin_pwsh_node)


  } catch (err: any) {
    return `${err}`
  }

}

async function setupFileDotNRC(fileContent: string) {
  try {
    fs.writeFileSync(DIR_PATH_HOME_DOT_N_DOT_NRC_FILE, fileContent);
    updateEnvironmentVariables(fileContent)
    console.log(fileContent);

    return true
  } catch (err) {
    return false
  }
}


async function validateDirVersion(directoryPathName: string) {
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


export async function setup() {
  try {
    const setx = spawn(`setx`, [`N_HOME`, `${DIR_PATH_PROJECT}`], {
      stdio: ['pipe', 'pipe', process.stderr],
      shell: true
    });

    const script_bin_sh_n: any = binScripts(DIR_PATH_PROJECT, 'n_script', 'sh')
    const script_bin_pwsh_n: any = binScripts(DIR_PATH_PROJECT, 'n_script', 'pwsh')
    const script_bin_cmd_n: any = binScripts(DIR_PATH_PROJECT, 'n_script', 'cmd')

    fs.writeFileSync(`${DIR_PATH_PROJECT}\\n`, script_bin_sh_n)
    fs.writeFileSync(`${DIR_PATH_PROJECT}\\n.ps1`, script_bin_pwsh_n)
    fs.writeFileSync(`${DIR_PATH_PROJECT}\\n.cmd`, script_bin_cmd_n)


    setx.on('close', (code) => {
      // process.stdout.write(`child process close all stdio with code ${code}`);
      const packageInit =  spawn(`./bin.exe`, [`init`, `-y`], {
        stdio: ['pipe', 'pipe', process.stderr],
        shell: true
      });
      packageInit.on('close', (code) => {
        const packageIinstall =  spawn(`./bin.exe`, [`i`, `@idev-coder/n`], {
          stdio: ['pipe', 'pipe', process.stderr],
          shell: true
        });

        packageIinstall.on('close', (code) => {
          console.log("Done!");
          
        })
      })
    });

    setx.on('exit', (code) => {
      // process.stdout.write(`child process exited with code ${code}`);

    });
   


    return DIR_PATH_PROJECT
  } catch (err) {
    return `${err}`
  }
}
