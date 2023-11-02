import database from "./database";
import {
  Admin,
  Settings,
  Users,
  Categories,
  Faculties,
  Departments,
} from "$lib/models";
import mongoose from "mongoose";

await database.connect();
const projectSmart = {
  title: 1,
  category: 1,
  images: 1,
  integrity: 1,
  createdAt: 1,
  isActive: 1,
};
export const getFaculties = async (skip: number = 0, limit: number = 20) => {
  return await Faculties.find().skip(skip).limit(limit).sort("-_id");
};
export const getDepartment = async (_id:string) => {
	return await Departments.find({_id}).lean();
}
export const getDepartments = async (startIndex: number, limit: number) => {
	const list = await Departments
	  .aggregate([
		{ $skip: startIndex },
		{ $limit: limit },
		{ $sort: { _id: -1 } },
		{
		  $lookup: {
			from: "faculties",
			localField: "faculty",
			foreignField: "_id",
			as: "faculty_",
		  },
		},
		{ $unwind: "$faculty_" },
		{
		  $project: {
			title: 1,
			faculty: 1,
			pageUrl: 1,
			createdAt: 1,
			is_active: 1,
			"faculty_.title": 1,
		  },
		},
	  ])
	  .exec();
	return list.map((e: any, i: number) => {
	  let x = {
		...e,
		faculty: e.faculty_.title,
		faculty_id: e.faculty_._id,
		index: ++i + startIndex,
	  };
	  delete x.faculty_;
	  return x;
	});
  };
export const getFaculty = async (_id: string) => {
  try {
    const product = await Faculties.findOne({ _id }).lean();
    let category = {};
    if (product)
      category = await Categories.findOne(
        { _id: new mongoose.Types.ObjectId(product.category) },
        { type: 1 }
      ).lean();
    return { product, category };
  } catch (e) {
    return false;
  }
};
export const mobileList = async (startIndex: number, limit: number) => {
  const list = await smartModel
    .aggregate([
      { $skip: startIndex },
      { $limit: limit },
      { $sort: { _id: -1 } },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "cat",
        },
      },
      { $unwind: "$cat" },
      {
        $project: {
          title: 1,
          category: 1,
          images: 1,
          integrity: 1,
          createdAt: 1,
          isActive: 1,
          "cat.category": 1,
          "cat._id": 1,
        },
      },
    ])
    .exec();
  return list.map((e: any, i: number) => {
    let x = {
      ...e,
      images: e.images.length > 1 ? [e.images[0]] : e.images,
      category: e.cat.category,
      category_id: e.cat._id,
      index: ++i + startIndex,
    };
    delete x.cat;
    return x;
  });
};

export const getSettings = async (): Promise<object[]> => {
  return await Settings.findOne(
    {},
    {
      cookiesOptions: 0,
      oneTimeAdminLoginKey: 0,
      updatedAt: 0,
      __v: 0,
      createdAt: 0,
    }
  ).sort("-_id");
};

export const getUsers = async (
  startIndex: number = 0,
  limit: number = 20,
  user_type: string = "users"
) => {
  if (user_type === "clients")
    return await Users.find().skip(startIndex).limit(limit).sort("-_id").lean();
  else return await Admin.find().lean();
};
