import * as path from 'path';
import * as fs from 'fs'

const resolveModule = (filePath: string) => {
    const appDirectory = fs.realpathSync(process.cwd());
    const resolveApp = (relativePath: any) => path.resolve(appDirectory, relativePath);
    
    const config = fs.existsSync(resolveApp(`${filePath}`))


    if (config) {
        return resolveApp(`${filePath}`);
    }
};
export function projectPathFile(fileName: string) {
    
    return resolveModule(fileName)
}