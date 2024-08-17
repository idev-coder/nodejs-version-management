import * as os from 'os'

export function engineNodeBin() {
    switch (os.platform()) {
        case "win32":
            return "node.exe"
            break;
        case "linux":
        case "darwin":
        case "aix":
        case "freebsd":
        case "openbsd":
        case "sunos":
            return "bin/node"
            break;
        default:
            return "bin/node"
            break;
    }
}

export function engineNPMBin() {
    switch (os.platform()) {
        case "win32":
            return "npm"
            break;
        case "linux":
        case "darwin":
        case "aix":
        case "freebsd":
        case "openbsd":
        case "sunos":
            return "bin/npm"
            break;
        default:
            return "bin/npm"
            break;
    }
}

export function engineNPXBin() {
    switch (os.platform()) {
        case "win32":
            return "npx"
            break;
        case "linux":
        case "darwin":
        case "aix":
        case "freebsd":
        case "openbsd":
        case "sunos":
            return "bin/npx"
            break;
        default:
            return "bin/npx"
            break;
    }
}
