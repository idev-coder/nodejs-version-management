import fs from 'fs'
import { DIR_PATH_HOME_DOT_N_DOT_NRC_FILE } from './common'
import { nodeLocalVersion, nodeOnlineVersion } from './node-version'
import { updateNodeVersion } from './update'
export default function readFileVersion(path: string) {
    return new Promise(async (res, rej) => {
        let baseEngineVersion = fs.readFileSync(DIR_PATH_HOME_DOT_N_DOT_NRC_FILE, 'utf8')
        let data = await fs.readFileSync(path, 'utf8')


        if (path.includes('package.json')) {

            let pkg = JSON.parse(data)
            if (Object.keys(pkg).includes('engines')) {

                let newEngine: any[] = []
                let engineNames = Object.keys(pkg.engines);
                if (engineNames.includes('node')) {
                    let nodeArr = pkg.engines['node'].split("^").join("").split(">").join("").split("<").join("").split("=").join("").split("~").join("").split(" ").join("").split("v").join("").split('||')


                    let newBaseEngineVersion = baseEngineVersion.split("v").join("")
                    let engineVersion = nodeArr.find((val: any) => val === newBaseEngineVersion) ? newBaseEngineVersion : nodeArr[(nodeArr.length - 1)]
                    let listOnline = await nodeOnlineVersion(engineVersion)
                    let listLocal = await nodeLocalVersion(engineVersion)

                    if (listLocal) {
                        newEngine.push({
                            type: 'engine',
                            key: 'node',
                            value: `v${listLocal.split("v").join("")}`
                        })
                    } else {

                        let update = await updateNodeVersion(listOnline.message)
                        if (update) {
                            newEngine.push({
                                type: 'engine',
                                key: 'node',
                                value: `v${listOnline.message.split("v").join("")}`
                            })
                        }

                    }
                } else if (engineNames.includes('npm')) {
                    let toolVersion = pkg.engines['npm'].split("v").join("")
                    newEngine.push({
                        type: 'tool',
                        key: 'npm',
                        value: `v${toolVersion}`
                    })
                } else if (engineNames.includes('yarn')) {
                    let toolVersion = pkg.engines['yarn'].split("v").join("")
                    newEngine.push({
                        type: 'tool',
                        key: 'yarn',
                        value: `v${toolVersion}`
                    })
                } else if (engineNames.includes('pnpm')) {
                    let toolVersion = pkg.engines['pnpm'].split("v").join("")
                    newEngine.push({
                        type: 'tool',
                        key: 'pnpm',
                        value: `v${toolVersion}`
                    })
                } else if (engineNames.includes('bun')) {
                    let toolVersion = pkg.engines['bun'].split("v").join("")
                    newEngine.push({
                        type: 'tool',
                        key: 'bun',
                        value: `v${toolVersion}`
                    })
                }




                res(newEngine)

            } else {
                let data = fs.readFileSync(DIR_PATH_HOME_DOT_N_DOT_NRC_FILE, 'utf8')
                let list = data.split("\n")

                if (list.length > 1) {
                    let newList: any[] = list.map((val) => {
                        if (val.includes('=')) {
                            let dataArr = val.split("=")
                            if (['node'].includes(dataArr[0])) {

                                return {
                                    type: 'engine',
                                    key: dataArr[0],
                                    value: `v${dataArr[1].split("v").join("")}`
                                }
                            } else if (['npm', 'yarn', 'pnpm', 'bun'].includes(dataArr[0])) {
                                return {
                                    type: 'tool',
                                    key: dataArr[0],
                                    value: `v${dataArr[1].split("v").join("")}`
                                }
                            }


                        } else if (val.includes(':')) {
                            let dataArr = val.split(":")
                            if (['node'].includes(dataArr[0])) {
                                return {
                                    type: 'engine',
                                    key: dataArr[0],
                                    value: `v${dataArr[1].split("v").join("")}`
                                }
                            } else if (['npm', 'yarn', 'pnpm', 'bun'].includes(dataArr[0])) {
                                return {
                                    type: 'tool',
                                    key: dataArr[0],
                                    value: `v${dataArr[1].split("v").join("")}`
                                }
                            }
                        } else {
                            return {
                                type: 'engine',
                                key: 'node',
                                value: `v${val[1].split("v").join("")}`
                            }
                        }
                    })

                    res(newList)
                } else {
                    if (list[0].includes('=')) {
                        let dataArr = list[0].split("=")
                        if (['node'].includes(dataArr[0])) {
                            res([{
                                type: 'engine',
                                key: dataArr[0],
                                value: `v${dataArr[1].split("v").join("")}`
                            }])
                        } else if (['npm', 'yarn', 'pnpm', 'bun'].includes(dataArr[0])) {
                            res([{
                                type: 'tool',
                                key: dataArr[0],
                                value: `v${dataArr[1].split("v").join("")}`
                            }])
                        }
                    } else if (list[0].includes(':')) {
                        let dataArr = list[0].split(":")
                        if (['node'].includes(dataArr[0])) {
                            res([{
                                type: 'engine',
                                key: dataArr[0],
                                value: `v${dataArr[1].split("v").join("")}`
                            }])
                        } else if (['npm', 'yarn', 'pnpm', 'bun'].includes(dataArr[0])) {
                            res([{
                                type: 'tool',
                                key: dataArr[0],
                                value: `v${dataArr[1].split("v").join("")}`
                            }])
                        }
                    } else {
                        res([{
                            type: 'engine',
                            key: 'node',
                            value: `v${list[0].split("v").join("")}`
                        }])
                    }
                }
            }

        } else {

            let list: any = data.includes('\n') ? data.split("\n") : data

            if (Array.isArray(list) && list.length > 1) {

                let newList = list.map((val: any) => {
                    if (val.includes('=')) {
                        let dataArr = val.split("=")
                        if (['node'].includes(dataArr[0])) {
                            return {
                                type: 'engine',
                                key: dataArr[0],
                                value: `v${dataArr[1].split("v").join("")}`
                            }
                        } else if (['npm', 'yarn', 'pnpm', 'bun'].includes(dataArr[0])) {
                            return {
                                type: 'tool',
                                key: dataArr[0],
                                value: `v${dataArr[1].split("v").join("")}`
                            }
                        }


                    } else if (val.includes(':')) {
                        let dataArr = val.split(":")
                        if (['node'].includes(dataArr[0])) {
                            return {
                                type: 'engine',
                                key: dataArr[0],
                                value: `v${dataArr[1].split("v").join("")}`
                            }
                        } else if (['npm', 'yarn', 'pnpm', 'bun'].includes(dataArr[0])) {
                            return {
                                type: 'tool',
                                key: dataArr[0],
                                value: `v${dataArr[1].split("v").join("")}`
                            }
                        }
                    } else {
                        return {
                            type: 'engine',
                            key: 'node',
                            value: `v${val.split("v").join("")}`
                        }
                    }
                })

                res(newList)
            } else {
                if (list.includes('=')) {

                    let dataArr = list.split("=")
                    if (['node'].includes(dataArr[0])) {
                        res([{
                            type: 'engine',
                            key: dataArr[0],
                            value: `v${dataArr[1].split("v").join("")}`
                        }])
                    } else if (['npm', 'yarn', 'pnpm', 'bun'].includes(dataArr[0])) {
                        res([{
                            type: 'tool',
                            key: dataArr[0],
                            value: `v${dataArr[1].split("v").join("")}`
                        }])
                    }
                } else if (list.includes(':')) {
                    let dataArr = list.split(":")

                    if (['node'].includes(dataArr[0])) {
                        res([{
                            type: 'engine',
                            key: dataArr[0],
                            value: `v${dataArr[1].split("v").join("")}`
                        }])
                    } else if (['npm', 'yarn', 'pnpm', 'bun'].includes(dataArr[0])) {
                        res([{
                            type: 'tool',
                            key: dataArr[0],
                            value: `v${dataArr[1].split("v").join("")}`
                        }])
                    }
                } else {

                    res([{
                        type: 'engine',
                        key: 'node',
                        value: `v${list.split("v").join("")}`
                    }])
                }
            }
        }
    })

}