import * as path from 'path';
import * as fs from 'fs'

const appDirectory = fs.realpathSync(process.cwd());

const resolveApp = (relativePath: string) => path.resolve(appDirectory, relativePath);

const resolveModule = (resolveFn: any, filePath: string) => {
    return resolveFn(`${filePath}`);
};

export function projectPathFile(fileName: string) {
    return resolveModule(resolveApp, fileName)
}