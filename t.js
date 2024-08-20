// $env:PATH


const { execFileSync } = require('child_process');
const fs = require('fs')

async function t() {
    try {
        const stdout = execFileSync('echo %PATH%', {
            // Capture stdout and stderr from child process. Overrides the
            // default behavior of streaming child stderr to the parent stderr
            stdio: 'pipe',

            // Use utf8 encoding for stdio pipes
            encoding: 'utf8',
            shell: true
        });

        const arrPath = stdout.split(";")
        const ncr = fs.readFileSync(`C:/Users/natthp49/.n/.nrc`, 'utf8')
        // console.log(`C:\\Users\\natthp49\\.n\\versions\\${ncr}`);
        // console.log(arrPath);

        arrPath[arrPath.indexOf(`C:\\Users\\natthp49\\.n\\versions\\${ncr}\\`)] = `C:\\Users\\natthp49\\.n\\versions\\${'v12.24.1'}\\`
        let toStr = arrPath.toString()
        // if(typeof toStr === "string") {
        return toStr
        //    toStr.replaceAll(',',';')
        //     console.log(toStr);

        // }
        // console.log(toStr.replaceAll(',',';'));
        // console.log(typeof toStr);

    } catch (err) {
        console.log("e");

        if (err.code) {
            // Spawning child process failed
            console.error(err.code);
        } else {
            // Child was spawned but exited with non-zero exit code
            // Error contains any stdout and stderr from the child
            const { stdout, stderr } = err;

            console.error({ stdout, stderr });
        }
    }
}


async function run() {
    const a = await t()
    const search = ",";
    const replacement = ";";

    const result = a.replace(new RegExp(search, 'g'), replacement);
    console.log(result);

}


run()