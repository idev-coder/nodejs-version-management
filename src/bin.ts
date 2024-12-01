export async function bin(name:string,options: any[]) {
    try {
        let op: any = options.toString()
        return `${name} ${op.replaceAll(',', ' ')}`

    } catch (err: any) {
        return `${err}`
    }
}
