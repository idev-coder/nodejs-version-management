export async function node(options: any[]): Promise<string> {
    try {
        const op = options.join(' ');
        return `node ${op}`;

    } catch (err) {
        return `${err}`;
    }
}

