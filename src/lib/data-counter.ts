import database from "./database";
import { Users, blogsModel, reviewsModel } from "./models";

await database.connect();
export const countCategories = async () => {
  const limit = 15;
  let topViewsBlogs = await blogsModel
    .find({}, { views: 1, _id: 0 })
    .sort({ views: -1 })
    .limit(limit);
  let lastUsers = await Users.find(
    {},
    {
      _id: 0,
      firstname: 1,
      lastname: 1,
      email: 1,
      avatar: 1,
      country: 1,
      createdAt: 1,
    }
  )
    .sort({ views: -1 })
    .limit(10)
    .lean();

  let lastReviews = await reviewsModel
    .aggregate([
      { $limit: 10 },
      { $sort: { _id: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          country: 1,
          createdAt: 1,
          review: 1,
          "user.avatar": 1,
          "user.firstname": 1,
          "user.lastname": 1,
        },
      },
    ])
    .exec();
  let views_blogs: any = [];
  topViewsBlogs.map((item: any) => views_blogs.push(item.views));

  return {
    chart_data: {
      views_blogs,
    },
    lastUsers,
    lastReviews,
  };
};
