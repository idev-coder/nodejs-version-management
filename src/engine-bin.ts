import * as os from 'os';

/**
 * Determines the appropriate path or filename for the Node.js binary
 * based on the operating system platform.
 * 
 * @returns {string} The Node.js binary path or filename.
 */
export function engineNodeBin(): string {
    const platform = os.platform();
    if (platform === "win32") {
        return "node.exe";
    }
    return "bin/node";
}

export function engineNPMBin(): string {
    const platform = os.platform();
    return platform === "win32" ? "npm" : "bin/npm";
}

/**
 * Determines the appropriate path to the `npx` binary based on the operating system platform.
 * @returns {string} The path to the `npx` binary.
 */
export function engineNPXBin(): string {
    const platform = os.platform();
    return platform === "win32" ? "npx" : "bin/npx";
}
