import fs from 'fs'
import path from 'path'
import pkg from './pkg';
import { DIR_PATH_HOME_DOT_N_VERSION_FOLDER, DIR_PATH_PROJECT_PACKAGE_JSON_FILE } from './common';
import { validateDirVersion, updateNodeVersion } from './update';
export function setEngine(key: string, value: string) {
    return new Promise(async (res, rej) => {
        let newPkg: any = pkg()

        if (['node'].includes(key)) {
            const outputDir = path.join(DIR_PATH_HOME_DOT_N_VERSION_FOLDER, value);
            let statusDirVersion = await validateDirVersion(DIR_PATH_HOME_DOT_N_VERSION_FOLDER)
            if (statusDirVersion) {
                let statusOutputDir = await validateDirVersion(outputDir)
                if (statusOutputDir) {
                    if (newPkg.engines) {
                        newPkg.engines[key] = value
                        let dataFile: any = await fs.writeFileSync(DIR_PATH_PROJECT_PACKAGE_JSON_FILE, JSON.stringify(newPkg, null, '\t'))
                        if (dataFile) {
                            let [val0, ...val] = value.split("")
                            res({
                                type: 'message',
                                value: `[✓] Engine Set Node > v${val0 === 'v' ? val.toString().toString().split(",").join(".") : [val0, ...val].toString().split(",").join(".")}`
                            })
                        }

                    } else {
                        newPkg.engines = {
                            [key]: value
                        }
                        let dataFile: any = await fs.writeFileSync(DIR_PATH_PROJECT_PACKAGE_JSON_FILE, JSON.stringify(newPkg, null, '\t'))
                        if (dataFile) {
                            let [val0, ...val] = value.split("")
                            res({
                                type: 'message',
                                value: `[✓] Engine Set Node > v${val0 === 'v' ? val.toString().toString().split(",").join(".") : [val0, ...val].toString().split(",").join(".")}`
                            })
                        }
                    }
                } else {
                    let update = await updateNodeVersion(value)
                    if (update) {
                        if (newPkg.engines) {
                            newPkg.engines[key] = value
                            let dataFile: any = await fs.writeFileSync(DIR_PATH_PROJECT_PACKAGE_JSON_FILE, JSON.stringify(newPkg, null, '\t'))
                            if (dataFile) {
                                let [val0, ...val] = value.split("")
                                res({
                                    type: 'message',
                                    value: `[✓] Engine Set Node > v${val0 === 'v' ? val.toString().toString().split(",").join(".") : [val0, ...val].toString().split(",").join(".")}`
                                })
                            }


                        } else {
                            newPkg.engines = {
                                [key]: value
                            }

                            let dataFile: any = await fs.writeFileSync(DIR_PATH_PROJECT_PACKAGE_JSON_FILE, JSON.stringify(newPkg, null, '\t'))
                            if (dataFile) {
                                let [val0, ...val] = value.split("")
                                res({
                                    type: 'message',
                                    value: `[✓] Engine Set Node > v${val0 === 'v' ? val.toString().toString().split(",").join(".") : [val0, ...val].toString().split(",").join(".")}`
                                })
                            }
                        }
                    }
                }
            }

        } else if (['npm', 'yarn', 'pnpm', 'bun'].includes(key)) {
            res({
                type: 'message',
                value: `[×] Not Supported Set Engine > ${key}`
            })
        }else {
            res({
                type: 'message',
                value: `[×] Set Engine Error`
            })
        }

    })

}
