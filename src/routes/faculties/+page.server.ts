import { parse } from "$lib/globals";
import { getFaculties } from "$lib/item-list";
import type { PageServerLoad } from "./$types";

export const load = (async ()=>{
    return {
        faculties: parse(await getFaculties())
    }
}) satisfies PageServerLoad