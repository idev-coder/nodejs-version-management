export async function npx(options: any[]): Promise<string> {
    try {
        const op = options.join(' ');
        return `npx ${op}`;
    } catch (err: any) {
        return `${err}`;
    }
}
