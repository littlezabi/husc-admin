import { getPagination, parse } from "$lib/globals";
import { getDepartments } from "$lib/item-list";
import type { PageServerLoad } from "./$types";

export const load = (async ({cookies, url})=>{
    const { skip, limit, page } = getPagination(cookies, url);
	const items = await getDepartments(skip, limit);
    return {
        departments: parse(items)
    }
}) satisfies PageServerLoad