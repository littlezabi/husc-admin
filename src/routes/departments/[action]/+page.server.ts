import { parse } from '$lib/globals';
import { getDepartment } from '$lib/item-list';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	if (params.action !== 'new') {
		let _id = params.action;
		let product = parse(await getDepartment(_id));
        if(product) return { product, action: 'edit' };
        throw error(404, 'Product not found please check your product id');
	}
	return { action: 'new' };
};
