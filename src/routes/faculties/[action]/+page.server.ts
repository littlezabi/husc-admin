import { parse } from '$lib/globals';
import { getFaculty } from '$lib/item-list';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	if (params.action !== 'new') {
		let _id = params.action;
		let {product, category}:any = parse(await getFaculty(_id));
        if(product) return { product, category, action: 'edit' };
        throw error(404, 'Product not found please check your product id');
	}
	return { action: 'new' };
};
