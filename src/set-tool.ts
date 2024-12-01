import * as fs from 'fs';
import { DIR_PATH_HOME_DOT_N_SETTING_FILE } from './common';

export function setTool(key: string) {
    return new Promise((res, rej) => {
        const toolName = key.split("=")[1]
        const filePath = DIR_PATH_HOME_DOT_N_SETTING_FILE
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                rej(err)
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

                        rej(err)
                    } else {
                        res(true)
                    }
                });

            } catch (parseErr) {
                rej(parseErr)
            }
        });
    })

} 