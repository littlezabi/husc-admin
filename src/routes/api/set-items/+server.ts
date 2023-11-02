import { authenticateAdmin } from '$lib/users';
import { handleFaculty } from '../update-items/handlers';
import { handleDepartment } from './set-items';

export const POST = async ({ request, cookies }: any) => {
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
	const requestFor = request.headers.get('requestFor')
	if (requestFor === 'faculty-new') return handleFaculty(await request.formData(), 'new')
	if (requestFor === 'department-new') return handleDepartment(await request.formData(), 'new')
	
	return new Response(JSON.stringify({ message: 'Its seem you accessing api without any data', success: 0 }), { status: 200 });
};
