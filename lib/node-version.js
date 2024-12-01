"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeOnlineVersion = nodeOnlineVersion;
exports.nodeLocalVersion = nodeLocalVersion;
const fs = __importStar(require("fs"));
const common_1 = require("./common");
const services_1 = require("./services");
function nodeOnlineVersion(name) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const listVersion = yield (0, services_1.nodeListVersion)();
            var numberRegex = /^\d+$/;
            if (name) {
                if (name === "latest") {
                    return listVersion[0].version;
                }
                else if (name === "lts") {
                    let dataVersions = listVersion.filter((val) => typeof val.lts === "string");
                    return {
                        message: dataVersions[0].version,
                        data: [dataVersions[0]]
                    };
                }
                else if (["argon", "boron", "dubnium", "erbium", "fermium", "gallium", "hydrogen", "iron"].includes(name)) {
                    let dataVersions = listVersion.filter((val) => typeof val.lts === "string" && val.lts.toLowerCase().includes(name));
                    return {
                        message: dataVersions[0].version,
                        data: [dataVersions[0]]
                    };
                }
                else {
                    let newName = name.toLowerCase();
                    let strToArr = newName.split("");
                    if (numberRegex.test(strToArr[0]) || (strToArr[0].includes("v") && numberRegex.test(strToArr[1]))) {
                        if (strToArr[0].includes("v")) {
                            let dataVersions = listVersion.filter((val) => val.version.includes(newName));
                            return {
                                message: dataVersions[0].version,
                                data: [dataVersions[0]]
                            };
                        }
                        else if (numberRegex.test(strToArr[0])) {
                            let strToArr = newName.split(".");
                            if (strToArr.length === 1) {
                                let dataVersions = listVersion.filter((val) => {
                                    let splitVersion = val.version.split(".");
                                    if (newName.length === 1) {
                                        if (splitVersion[0].split("")[1].includes(newName))
                                            return val;
                                    }
                                    else {
                                        if (splitVersion[0].includes(newName))
                                            return val;
                                    }
                                });
                                return {
                                    message: dataVersions[0].version,
                                    data: [dataVersions[0]]
                                };
                            }
                            else if (strToArr.length === 2) {
                                let dataVersions = listVersion.filter((val) => {
                                    let splitVersion = val.version.split(".");
                                    if (`${splitVersion[0]}.${splitVersion[1]}`.includes(newName))
                                        return val;
                                });
                                return {
                                    message: dataVersions[0].version,
                                    data: [dataVersions[0]]
                                };
                            }
                            else {
                                let dataVersions = listVersion.filter((val) => val.version.includes(newName));
                                if (dataVersions.length > 0) {
                                    return {
                                        message: dataVersions[0].version,
                                        data: [dataVersions[0]]
                                    };
                                }
                                return {
                                    message: common_1.MSG_NODE_VERSION_NOT_FOULT,
                                    data: []
                                };
                            }
                        }
                    }
                    else {
                        return {
                            message: common_1.MSG_NODE_NOT_VERSION_TYPE,
                            data: []
                        };
                    }
                }
            }
            else {
                let nameVersions = listVersion.map((val) => val.version);
                let arrToStr = nameVersions.toString();
                return {
                    message: arrToStr.replaceAll(',', "\n"),
                    data: listVersion
                };
            }
        }
        catch (err) {
            return err;
        }
    });
}
function nodeLocalVersion(name) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const files = fs.readdirSync(common_1.DIR_PATH_HOME_DOT_N_VERSION_FOLDER, { withFileTypes: true });
            const versions = [];
            files.forEach((file) => {
                if (file.isDirectory()) {
                    versions.push(file.name);
                }
            });
            if (name) {
                return versions.find((val) => val === name);
            }
            else {
                let arrToStr = versions.toString();
                return arrToStr.replaceAll(',', "\n");
            }
        }
        catch (err) {
            return "";
        }
    });
}
