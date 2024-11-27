export async function npm(options: string[]): Promise<string> {
    try {
        const op = options.join(' ');
        return `npm ${op}`;
    } catch (err: any) {
        return `${err}`;
    }
}
