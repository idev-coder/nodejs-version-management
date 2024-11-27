import * as path from 'path';
import * as fs from 'fs'

const appDirectory = fs.realpathSync(process.cwd());

const resolveApp = (relativePath: string) => path.resolve(appDirectory, relativePath);

const resolveModule = (resolveFn: (path: string) => any, filePath: string): any => resolveFn(filePath);

/**
 * Resolves the path of a given file within the project.
 * 
 * @param fileName - The name of the file to resolve.
 * @returns The resolved path of the specified file.
 */
export function projectPathFile(fileName: string): string {
    return resolveModule(resolveApp, fileName);
}