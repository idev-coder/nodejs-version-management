

export interface NodeVersionType {
    version: string;
    date: string;
    files: any[];
    npm: string;
    v8: string;
    uv: string;
    zlib: string;
    openssl: string;
    modules: string;
    lts: string | boolean;
    security: boolean;
}

export interface VersionDataType {
    message: string,
    data: any[]
}

export interface EngineVersionType {
    node: string;
    npm: string
}