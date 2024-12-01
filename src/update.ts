import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { downloadAndUnzip } from './download';
import { arch, DIR_PATH_HOME_DOT_N_DOT_NRC_FILE, DIR_PATH_HOME_DOT_N_FOLDER, DIR_PATH_HOME_DOT_N_VERSION_FOLDER, DIR_PATH_HOME_FOLDER, NODE_DOWNLOAD_MIRROR_URI, platform } from './common';

export function updateNodeVersion(name: string) {
  return new Promise(async (res, rej) => {
    const url = `${NODE_DOWNLOAD_MIRROR_URI}/release/${name}/node-${name}-${platform}-${arch}.${os.platform() === "win32" ? "zip" : "tar.xz"}`
    const filePath = path.basename(url);

    const outputDir = path.join(DIR_PATH_HOME_DOT_N_VERSION_FOLDER, name);
    const outputDownloadDir = path.join(DIR_PATH_HOME_DOT_N_VERSION_FOLDER, filePath);


    let statusDirVersion = await validateDirVersion(DIR_PATH_HOME_DOT_N_VERSION_FOLDER)
    if (statusDirVersion) {
      let statusOutputDir = await validateDirVersion(outputDir)
      if (statusOutputDir) {
        updateFileDotNRC(name)
        let setup = await updateEnvironmentVariables(name)
        if (setup) {
          res(true)
        }
      } else {
        updateFileDotNRC(name)
        let download = await downloadAndUnzip(url, outputDownloadDir, DIR_PATH_HOME_DOT_N_VERSION_FOLDER, name)
        if (download) {

          let updatePkg = await updateEnvironmentVariables(name)
          if (updatePkg) {
            res(true)
          }

        }

      }
    } else {
      let status: boolean
      status = await updateFileDotNRC("")
      const folderDotNVersion = await setupFolderDotNVersion()

      if (status && folderDotNVersion) {

        updateFileDotNRC(name)
        let download = await downloadAndUnzip(url, outputDownloadDir, DIR_PATH_HOME_DOT_N_VERSION_FOLDER, name)
        if (download) {

          let setup = await updateEnvironmentVariables(name)
          if (setup) {
            // process.stdout.write('Done!\n');
            // process.exit(0);
            res(true)
          }


        }


      }
    }
  })


}

export async function setupFolderDotNVersion() {
  return new Promise((res, rej) => {
    const folders = fs.readdirSync(DIR_PATH_HOME_DOT_N_FOLDER);
    if (!folders.includes('node_versions')) {
      fs.mkdirSync(DIR_PATH_HOME_DOT_N_VERSION_FOLDER, { recursive: true });
      res(true)
    }
    res(true)
  })

}

export async function updateEnvironmentVariables(newVersion: string) {
  return new Promise((res, rej) => {
    var newVersionPath: any = `${DIR_PATH_HOME_DOT_N_VERSION_FOLDER}\\${newVersion}`
    let results: any[] = [];

    const files = fs.readdirSync(newVersionPath);
    files.forEach(file => {
      const filePath = path.join(newVersionPath, file);
      const stats = fs.statSync(filePath);

      if (!stats.isDirectory()) {
        let fileName = file.split('.')[0]
        const pathName = path.join(newVersionPath, fileName);
        if (file.includes(".exe") || file.includes(".bat") || file.includes(".cmd") || file.includes(".ps1")) {
          if (file.includes(".exe") || file.includes(".bat")) {

            fs.writeFileSync(`${DIR_PATH_HOME_DOT_N_FOLDER}\\${fileName}`, `#!/bin/sh
exec "${pathName}"  "$@"`)
            fs.writeFileSync(`${DIR_PATH_HOME_DOT_N_FOLDER}\\${fileName}.cmd`, `@ECHO off
GOTO start
:find_dp0
SET dp0=%~dp0
EXIT /b
:start
SETLOCAL
CALL :find_dp0
${pathName} %*`)
            fs.writeFileSync(`${DIR_PATH_HOME_DOT_N_FOLDER}\\${fileName}.ps1`, `#!/usr/bin/env pwsh
& "${pathName}"  $args
exit $LASTEXITCODE`)
            results.push(pathName);

          } else {
            if (file.includes(".cmd")) {
              fs.writeFileSync(`${DIR_PATH_HOME_DOT_N_FOLDER}\\${file}`, `@ECHO off
GOTO start
:find_dp0
SET dp0=%~dp0
EXIT /b
:start
SETLOCAL
CALL :find_dp0
${pathName} %*`)
              results.push(pathName);
            } else if (file.includes(".ps1")) {
              fs.writeFileSync(`${DIR_PATH_HOME_DOT_N_FOLDER}\\${file}`, `#!/usr/bin/env pwsh
& "${pathName}"  $args
exit $LASTEXITCODE`)
              results.push(pathName);
            }
          }
        } else if (!file.includes('.')) {
          if (!file.includes('LICENSE')) {
            fs.writeFileSync(`${DIR_PATH_HOME_DOT_N_FOLDER}\\${file}`, `#!/bin/sh
exec "${pathName}"  "$@"`)
            results.push(pathName);
          }

        }

      }
    });

    res(results)
    process.stdout.write("[✓] Update\n");

  })

}

export async function updateFileDotNRC(fileContent: string) {
  try {
    fs.writeFileSync(DIR_PATH_HOME_DOT_N_DOT_NRC_FILE, fileContent);

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
