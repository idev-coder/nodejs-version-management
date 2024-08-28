import * as os from 'os'
import * as path from 'path'
import * as pkg from '../package.json';
import { projectPathFile } from './project-path-file';
import { execFileSync, spawn } from 'child_process'
const stdout:any = execFileSync('echo',['%N_HOME%'], {
    // Capture stdout and stderr from child process. Overrides the
    // default behavior of streaming child stderr to the parent stderr
    stdio: 'pipe',

    // Use utf8 encoding for stdio pipes
    encoding: 'utf8',
    shell: true
  });
  
export const NODE_MIRROR_URI: string = "https://nodejs.org/dist";
export const NODE_DOWNLOAD_MIRROR_URI: string = "https://nodejs.org/download";
export const MSG_NODE_VERSION_NOT_FOULT: string = "node.js version not found";
export const MSG_NODE_NOT_VERSION_TYPE: string = "node.js not version type";
export const MSG_REMOVE_NODE_VERSION_SUCCESS: any = (version:string) => `remove node.js ${version} success`;
export const MSG_REMOVE_NODE_VERSION_FAILED: any = (version:string) => `remove node.js ${version} failed`;
export const platform: string = os.platform() === "win32" ? "win" : os.platform();
export const arch: string = os.arch();
export const VERSION: string = pkg.version
export const DIR_PATH_PROJECT: string = projectPathFile("")
export const DIR_PATH_PROJECT_DOT_NRC_FILE: string = projectPathFile(".nrc")
export const DIR_PATH_PROJECT_DOT_NVMRC_FILE: string = projectPathFile(".nvmrc")
export const DIR_PATH_PROJECT_DOT_NODE_VERSION_FILE: string = projectPathFile(".node-version")
export const DIR_PATH_PROJECT_PACKAGE_JSON_FILE: string = projectPathFile("package.json")
export const DIR_PATH_HOME_FOLDER: string = stdout.replace('\r\n','')
export const DIR_PATH_HOME_DOT_N_FOLDER: string = path.join(DIR_PATH_HOME_FOLDER, '.n');
export const DIR_PATH_HOME_DOT_N_VERSION_FOLDER: string = path.join(DIR_PATH_HOME_FOLDER, 'node_versions');
export const DIR_PATH_HOME_DOT_N_DOT_NRC_FILE: string = path.join(DIR_PATH_HOME_FOLDER, '.nrc');
