import { NODE_MIRROR_URI } from "./common";

export async function nodeListVersion() {
    try {
        const requestOptions: RequestInit = {
            method: "GET",
            redirect: "follow"
        };

        const response = await fetch(`${NODE_MIRROR_URI}/index.json`, requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}