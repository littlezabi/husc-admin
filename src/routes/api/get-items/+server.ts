import database from '$lib/database';
import countries from '$lib/assets/countries.json';
import { authenticateAdmin } from '$lib/users';
import { adminLogin, checkUsername, dataCount, emptyRequest, getFaculty } from './get-items';
import { getSettings } from '$lib/item-list';

await database.connect();
export const POST = async ({ request, cookies }: any) => {
	const body = await request.json();
	if (body.adminLogin) return adminLogin(body);
	else return emptyRequest();
};
export const GET = async ({ url, cookies, request }: any) => {
	if (url.searchParams.get('count-items')) return dataCount();
	let authenticated = await authenticateAdmin(cookies.get('admin'));
	if (!authenticated) {
		cookies.delete('admin');
		return new Response(
			JSON.stringify({
				message: 'Admin Authentication Failed!',
				success: 0,
				error: 'unauthenticated_user'
			})
		);
	}
	if (url.searchParams.get('getCountries')) return new Response(JSON.stringify(countries), { status: 200 });
	if (url.searchParams.get('checkUsername')) return checkUsername(url.searchParams.get('username'));
	if (url.searchParams.get('getFaculty')) return getFaculty(false, false, {category: 1, type: 1, _id: 1}, url.searchParams.get('getTypes'));
	if (url.searchParams.get('getSettings')) return new Response(JSON.stringify(await getSettings()), { status: 200 });
};
