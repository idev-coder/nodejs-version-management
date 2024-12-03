import * as os from 'os'
import * as path from 'path'
import * as pkg from '../package.json';
import { projectPathFile } from './project-path-file';
  
export const NODE_MIRROR_URI: string = "https://nodejs.org/dist";
export const NODE_DOWNLOAD_MIRROR_URI: string = "https://nodejs.org/download";
export const DENO_DOWNLOAD_MIRROR_URI: string = "https://github.com/denoland/deno/release/download";
export const MSG_NODE_VERSION_NOT_FOULT: string = "node.js version not found";
export const MSG_NODE_NOT_VERSION_TYPE: string = "node.js not version type";
export const MSG_REMOVE_NODE_VERSION_SUCCESS: any = (version:string) => `remove node.js ${version} success`;
export const MSG_REMOVE_NODE_VERSION_FAILED: any = (version:string) => `remove node.js ${version} failed`;
export const platform: string = os.platform() === "win32" ? "win" : os.platform();
export const arch: string = os.arch();
export const VERSION: string = pkg.version
export const DIR_PATH_PROJECT: string | any = projectPathFile("")
export const DIR_PATH_PROJECT_DOT_NRC_FILE: string | any = projectPathFile(".nrc")
export const DIR_PATH_PROJECT_DOT_NVMRC_FILE: string | any = projectPathFile(".nvmrc")
export const DIR_PATH_PROJECT_DOT_NODE_VERSION_FILE: string | any = projectPathFile(".node-version")
export const DIR_PATH_PROJECT_PACKAGE_JSON_FILE: string | any = projectPathFile("package.json")
export const DIR_PATH_HOME_FOLDER: string = os.homedir()
export const DIR_PATH_HOME_DOT_N_FOLDER: string = path.join(DIR_PATH_HOME_FOLDER, '.n');
export const DIR_PATH_HOME_DOT_N_VERSION_FOLDER: string = path.join(DIR_PATH_HOME_DOT_N_FOLDER, 'node_versions');
export const DIR_PATH_HOME_DOT_N_BIN_FOLDER: string = path.join(DIR_PATH_HOME_DOT_N_FOLDER, 'bin');
export const DIR_PATH_HOME_DOT_N_DOT_NRC_FILE: string = path.join(DIR_PATH_HOME_DOT_N_FOLDER, '.nrc');
export const DIR_PATH_HOME_DOT_N_PATH_FILE: string = path.join(DIR_PATH_HOME_DOT_N_FOLDER, 'path.txt');
export const DIR_PATH_HOME_DOT_N_SETTING_FILE: string = path.join(DIR_PATH_HOME_DOT_N_FOLDER, 'settings.json');
