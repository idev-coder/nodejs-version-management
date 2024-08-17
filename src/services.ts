import { NODE_MIRROR_URI } from "./common";

export async function nodeListVersion() {
    try {
        const requestOptions: any = {
            method: "GET",
            redirect: "follow"
        };

        const res = await fetch(`${NODE_MIRROR_URI}/index.json`, requestOptions)
        return res.json()
    } catch (err: any) {
        return err
    }

}