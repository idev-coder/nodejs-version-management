import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { downloadAndUnzip } from './download';
import { arch, DIR_PATH_HOME_DOT_N_DOT_NRC_FILE, DIR_PATH_HOME_DOT_N_VERSION_FOLDER, DIR_PATH_HOME_FOLDER, DIR_PATH_PROJECT, NODE_DOWNLOAD_MIRROR_URI, platform } from './common';
import { binScripts } from './bin-scripts';

export async function setupNodeVersion(name: string) {
  const isWindows = os.platform() === "win32";
  const fileExtension = isWindows ? "zip" : "tar.xz";
  const url = `${NODE_DOWNLOAD_MIRROR_URI}/release/${name}/node-${name}-${platform}-${arch}.${fileExtension}`;
  const filePath = path.basename(url);

  const outputDir = path.join(DIR_PATH_HOME_DOT_N_VERSION_FOLDER, name);
  const outputDownloadDir = path.join(DIR_PATH_HOME_DOT_N_VERSION_FOLDER, filePath);

  const statusDirVersion = await validateDirVersion(DIR_PATH_HOME_DOT_N_VERSION_FOLDER);
  if (statusDirVersion) {
    const statusOutputDir = await validateDirVersion(outputDir);
    if (!statusOutputDir) {
      await downloadAndUnzip(url, outputDownloadDir, DIR_PATH_HOME_DOT_N_VERSION_FOLDER, name);
    }
    setupFileDotNRC(name);
  } else {
    const status = await setupFileDotNRC("") && await setupFloderDotNVersion();
    if (status) {
      setupFileDotNRC(name);
      await downloadAndUnzip(url, filePath, DIR_PATH_HOME_DOT_N_VERSION_FOLDER, name);
    }
  }
}

async function setupFloderDotNVersion(): Promise<boolean> {
  try {
    fs.mkdirSync(DIR_PATH_HOME_DOT_N_VERSION_FOLDER, { recursive: true });
    return true;
  } catch {
    return false;
  }
}



function updateEnvironmentVariables(newVersion: string) {
  try {
    const newVersionPath:any = `${DIR_PATH_HOME_DOT_N_VERSION_FOLDER}\\${newVersion}`;
    const newVersionPathUnix = newVersionPath.replaceAll('\\', '/');

    const commands = ['npm', 'npx', 'node'];
    const formats = ['sh', 'cmd', 'pwsh'];

    commands.forEach(command => {
      formats.forEach(format => {
        const scriptContent:any = binScripts(
          format === 'cmd' ? newVersionPath : newVersionPathUnix,
          command,
          format
        );
        const fileExtension = format === 'sh' ? '' : `.${format}`;
        fs.writeFileSync(`${DIR_PATH_HOME_FOLDER}\\${command}${fileExtension}`, scriptContent);
      });
    });
  } catch (err) {
    return `${err}`;
  }
}

/**
 * Writes content to a specified file, updates environment variables, and logs the content.
 * @param fileContent - The content to be written and used for updating environment variables.
 * @returns A promise that resolves to true if successful, otherwise false.
 */
async function setupFileDotNRC(fileContent: string): Promise<boolean> {
  try {
    fs.writeFileSync(DIR_PATH_HOME_DOT_N_DOT_NRC_FILE, fileContent);
    updateEnvironmentVariables(fileContent);
    return true;
  } catch (err) {
    console.error('Error writing file or updating environment variables:', err);
    return false;
  }
}


/**
 * Validates if the directory can be read successfully.
 * @param directoryPathName - The path to the directory to validate.
 * @returns A promise that resolves to true if the directory is read successfully, false otherwise.
 */
async function validateDirVersion(directoryPathName: string): Promise<boolean> {
  try {
    fs.readdirSync(directoryPathName, { withFileTypes: true }).forEach(file => {
      if (file.isDirectory()) {
        // Placeholder for future logic if needed
      }
    });
    return true;
  } catch {
    return false;
  }
}
