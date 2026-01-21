import { fetch } from "bun";

// Custom func in case I change the impl
export async function getContent(url : string) {
    return await fetch(url).then((resp)=>resp.text())
}