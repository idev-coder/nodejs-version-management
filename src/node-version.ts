import * as fs from 'fs'
import { MSG_NODE_VERSION_NOT_FOULT, MSG_NODE_NOT_VERSION_TYPE, DIR_PATH_HOME_DOT_N_VERSION_FOLDER } from "./common";
import { nodeListVersion } from "./services";
import { NodeVersionType, VersionDataType } from "./types";

export async function nodeOnlineVersion(name?: string | null | undefined) {
    try {
        const listVersion: Array<NodeVersionType> = await nodeListVersion()
        var numberRegex = /^\d+$/;

        if (name) {
            if (name === "latest") {
                return listVersion[0].version;
            } else if (name === "lts") {
                let dataVersions = listVersion.filter((val: NodeVersionType) => typeof val.lts === "string")
                return {
                    message: dataVersions[0].version,
                    data: [dataVersions[0]]
                }
            } else if (["argon", "boron", "dubnium", "erbium", "fermium", "gallium", "hydrogen", "iron"].includes(name)) {
                let dataVersions = listVersion.filter((val: NodeVersionType) => typeof val.lts === "string" && val.lts.toLowerCase().includes(name))

                return {
                    message: dataVersions[0].version,
                    data: [dataVersions[0]]
                }
            } else {
                let newName = name.toLowerCase()
                let strToArr = newName.split("")

                if (numberRegex.test(strToArr[0]) || (strToArr[0].includes("v") && numberRegex.test(strToArr[1]))) {
                    if (strToArr[0].includes("v")) {
                        let dataVersions = listVersion.filter((val: NodeVersionType) => val.version.includes(newName))

                        return {
                            message: dataVersions[0].version,
                            data: [dataVersions[0]]
                        }
                    } else if (numberRegex.test(strToArr[0])) {
                        let strToArr = newName.split(".")

                        if (strToArr.length === 1) {
                            let dataVersions = listVersion.filter((val: NodeVersionType) => {
                                let splitVersion = val.version.split(".")
                                if (splitVersion[0].includes(newName)) return val
                            })
                            return {
                                message: dataVersions[0].version,
                                data: [dataVersions[0]]
                            }
                        } else if (strToArr.length === 2) {
                            let dataVersions = listVersion.filter((val: NodeVersionType) => {
                                let splitVersion = val.version.split(".")
                                if (`${splitVersion[0]}.${splitVersion[1]}`.includes(newName)) return val
                            })
                            return {
                                message: dataVersions[0].version,
                                data: [dataVersions[0]]
                            }
                        } else {
                            let dataVersions = listVersion.filter((val: NodeVersionType) => val.version.includes(newName))

                            if (dataVersions.length > 0) {
                                return {
                                    message: dataVersions[0].version,
                                    data: [dataVersions[0]]
                                }
                            }
                            return {
                                message: MSG_NODE_VERSION_NOT_FOULT,
                                data: []
                            }
                        }

                    }

                } else {
                    return {
                        message: MSG_NODE_NOT_VERSION_TYPE,
                        data: []
                    }
                }


            }

        } else {
            let nameVersions = listVersion.map((val) => val.version)
            let arrToStr: any = nameVersions.toString()
            return {
                message: arrToStr.replaceAll(',', "\n"),
                data: listVersion
            }
        }

    } catch (err: any) {

        return err
    }
}

export async function nodeLocalVersion(name?: string | null | undefined) {
    try {
        const files = fs.readdirSync(DIR_PATH_HOME_DOT_N_VERSION_FOLDER, { withFileTypes: true });
        // console.log('รายการโฟลเดอร์:');
        const versions: any[] = []

        files.forEach((file) => {
            if (file.isDirectory()) {
                // console.log(file.name);
                versions.push(file.name)
            }
        });


        if (name) {
            return versions.find((val: string) => val === name)
        } else {
            let arrToStr: any = versions.toString()
            return arrToStr.replaceAll(',', "\n")

        }
    } catch (err: any) {
        return ""
    }
}