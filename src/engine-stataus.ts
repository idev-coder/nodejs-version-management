import fs from 'fs'
import path from 'path'
import { DIR_PATH_HOME_DOT_N_SETTING_FILE, DIR_PATH_PROJECT_DOT_NRC_FILE, DIR_PATH_PROJECT_DOT_NVMRC_FILE, DIR_PATH_PROJECT_DOT_NODE_VERSION_FILE, DIR_PATH_PROJECT_PACKAGE_JSON_FILE, DIR_PATH_HOME_DOT_N_DOT_NRC_FILE, DIR_PATH_HOME_DOT_N_VERSION_FOLDER } from './common'
import readFileVersion from './read-file-version'

export function engineStatus() {
    
    return new Promise(async (res, rej) => {
        let settingStr: any = fs.readFileSync(DIR_PATH_HOME_DOT_N_SETTING_FILE)
        let { engine, tool } = JSON.parse(settingStr)
        let baseEngine: any = await readFileVersion(DIR_PATH_HOME_DOT_N_DOT_NRC_FILE)
      
        
        let pathTool = path.join(DIR_PATH_HOME_DOT_N_VERSION_FOLDER, baseEngine.find((val: any) => val.type === 'engine').value, 'node_modules', tool, 'package.json')

        let baseToolVersion: any = JSON.parse(await fs.readFileSync(pathTool, 'utf8')).version

        
        if (DIR_PATH_PROJECT_DOT_NRC_FILE) {
            let engineData: any = await readFileVersion(DIR_PATH_PROJECT_DOT_NRC_FILE)
       
            let newEngineData: any[] = engineData.filter((val: any) => val.type === 'tool')
            if (newEngineData.filter((val) => val.type === 'tool').length > 0) {
                res(engineData)
            } else {
                engineData.push({
                    type: 'tool',
                    key: tool,
                    value: `v${baseToolVersion.split("v").join("")}`
                })
                res(engineData)
            }
        } else if (DIR_PATH_PROJECT_DOT_NVMRC_FILE) {
            let engineData: any = await readFileVersion(DIR_PATH_PROJECT_DOT_NVMRC_FILE)

            let newEngineData: any[] = engineData.filter((val: any) => val.type === 'tool')
            if (newEngineData.filter((val) => val.type === 'tool').length > 0) {
                res(engineData)
            } else {
                engineData.push({
                    type: 'tool',
                    key: tool,
                    value: `v${baseToolVersion.split("v").join("")}`
                })
                res(engineData)
            }
        } else if (DIR_PATH_PROJECT_DOT_NODE_VERSION_FILE) {
            let engineData: any = await readFileVersion(DIR_PATH_PROJECT_DOT_NODE_VERSION_FILE)

            let newEngineData: any[] = engineData.filter((val: any) => val.type === 'tool')
            if (newEngineData.filter((val) => val.type === 'tool').length > 0) {
                res(engineData)
            } else {
                engineData.push({
                    type: 'tool',
                    key: tool,
                    value: `v${baseToolVersion.split("v").join("")}`
                })
                res(engineData)
            }
        } else if (DIR_PATH_PROJECT_PACKAGE_JSON_FILE) {
            
            let engineData: any = await readFileVersion(DIR_PATH_PROJECT_PACKAGE_JSON_FILE)
   
            let newEngineData: any[] = engineData.filter((val: any) => val.type === 'tool')
            if (newEngineData.filter((val) => val.type === 'tool').length > 0) {
                res(engineData)
            } else {
                engineData.push({
                    type: 'tool',
                    key: tool,
                    value: `v${baseToolVersion.split("v").join("")}`
                })
                res(engineData)
            }
        } else {
            let engineData: any = await readFileVersion(DIR_PATH_HOME_DOT_N_DOT_NRC_FILE)
            let newEngineData: any[] = engineData.filter((val: any) => val.type === 'tool')
            if (newEngineData.filter((val) => val.type === 'tool').length > 0) {
                res(engineData)
            } else {
                engineData.push({
                    type: 'tool',
                    key: tool,
                    value: `v${baseToolVersion.split("v").join("")}`
                })
                res(engineData)
            }

        }
    })
}