import {
	Admin,
	Announcments,
	Users,
	blogsModel,
	Categories,
	reviewsModel,
	Faculties
} from '$lib/models';
import { generateJWT } from '$lib/users';
import bcrypt from 'bcryptjs';

export const getFaculty = async ()=>{
	let cats = await Faculties.find({}, {title: 1, _id: 1, pageUrl: 1}).sort('-_id');
	return new Response(JSON.stringify({ cats }), { status: 200 });
}

export const dataCount = async () => {
	const counter = {
		blogs: await blogsModel.count(),
		clients: await Users.count(),
		admin: await Admin.count(),
		reviews: await reviewsModel.count(),
		announcments: await Announcments.count(),
		categories: await Categories.count()
	};
	return new Response(JSON.stringify({ counter }), { status: 200 });
};
export const checkUsername = async (username: string) => {
	return new Response(
		JSON.stringify({
			exist: (await Admin.findOne({ username }, { username: 1 })) ? 1 : 0
		}),
		{ status: 200 }
	);
};
export const adminLogin = async (body: any) => {
	const { username, password } = body;
	let response: any = { message: '', status: 0, admin: false };
	if (username !== '' && password !== '') {
		let admin = await Admin.findOne({ username });
		if (!admin) {
			admin = await Admin.findOne({ email: username });
		}
		if (admin) {
			if (bcrypt.compareSync(password, admin.password)) {
				const a = {
					username: admin.username,
					email: admin.email,
					avatar: admin.avatar,
					_id: admin._id
				};
				const jwt = generateJWT(a);
				response = { message: 'successfully logged!', admin: { ...a, jwt }, status: 1 };
			} else response = { message: 'Username password is incorrect!', status: 0 };
		} else response = { message: 'Username or email is incorrect try again!', status: 0 };
	} else response = { message: 'Authentication is not correct please check it again!', status: 0 };

	return new Response(JSON.stringify(response), { status: 200 });
};
export const emptyRequest = () => {
	return new Response(
		JSON.stringify({ message: "Don't try to access api without authorization!" }),
		{ status: 401 }
	);
};
