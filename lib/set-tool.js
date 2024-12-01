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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTool = setTool;
const fs = __importStar(require("fs"));
const common_1 = require("./common");
function setTool(key) {
    return new Promise((res, rej) => {
        const toolName = key.split("=")[1];
        const filePath = common_1.DIR_PATH_HOME_DOT_N_SETTING_FILE;
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                rej(err);
                return;
            }
            try {
                // Step 2: Parse the JSON content
                let jsonData = JSON.parse(data);
                // Step 3: Modify the data
                // Example: Adding a new property or updating an existing one
                jsonData.tool = toolName;
                // Step 4: Write the updated data back to the file
                fs.writeFile(filePath, JSON.stringify(jsonData, null, '\t'), 'utf8', (err) => {
                    if (err) {
                        rej(err);
                    }
                    else {
                        res(true);
                    }
                });
            }
            catch (parseErr) {
                rej(parseErr);
            }
        });
    });
}
