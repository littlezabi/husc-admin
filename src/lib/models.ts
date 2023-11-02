import mongoose from "mongoose";
import { getRandomChar } from "./globals";
mongoose.set("strictQuery", true);

const FacultiesSchema = new mongoose.Schema(
  {
    title: { type: String, require: true },
    pageUrl: { type: String, require: true },
    keywords: { type: String, required: false },
    is_active: { type: Boolean, default: true },
    is_new: { type: Boolean, default: true },
    departments: {type: Number, default: 0},
    slug: { type: String, require: true },
  },
  {
    timestamps: true,
  }
);

const DepartmentSchema = new mongoose.Schema(
  {
    title: { type: String, require: true },
    pageUrl: { type: String, require: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: "faculties" },
    keywords: { type: String, require: false },
    is_active: { type: Boolean, default: true },
    is_new: { type: Boolean, default: true },
    slug: { type: String, require: true },
  },
  {
    timestamps: true,
  }
);

const AdminSchema = new mongoose.Schema({
  username: { type: String, length: 100, require: true },
  email: { type: String, length: 120, require: true },
  password: { type: String, require: true },
  avatar: { type: String, require: false },
  lastLogin: { type: String, require: false },
  active: { type: Boolean, default: true },
});

const SettingsSchema = new mongoose.Schema(
  {
    websiteName: {
      type: String,
      default: "Hazara University Sub Campus Battagram",
    },
    timeAfterAnnouncmentVisible: { type: Number, default: 10000 },
    itemsPerPage: { type: Number, default: 25 },
    showAnnouncement: { type: Boolean, default: true },
    latestBlogsLimit: { type: Number, default: 10 },
    paginateButtonShow: { type: Number, default: 6 },
    mainNewArrivalsLimit: { type: Number, default: 10 },
    searchResultLimit: { type: Number, default: 5 },
    modalRemovingTime: { type: Number, default: 300 },
    perPostCommentAllow: { type: Number, default: 5 },
    commentsLimit: { type: Number, default: 15 },
    cookiesOptions: {
      type: Object,
      default: { path: "/", httpOnly: true, secure: true, maxAge: 15552000 },
    },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);
const AnnouncmentsSchema = new mongoose.Schema(
  {
    type: { type: String, require: true },
    title: { type: String, require: true },
    body: { type: String, require: true },
    image: { type: String, required: false },
    active: { type: Number, default: true },
  },
  { timestamps: true }
);

const usersSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true, unique: false },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, required: false },
    country: { type: String, default: false },
    notifyme: { type: Boolean, required: false },
    active: { type: Boolean, required: true, default: false },
    code: { type: String, required: true },
  },
  {
    timestamps: true,
    strict: false,
  }
);
const reviewsSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    user_id: { type: String, required: true },
    review: { type: String, required: true },
    country: { type: String, required: false },
    post_id: { type: String, required: true },
  },
  {
    timestamps: true,
    strict: false,
  }
);

const categoriesSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    type: { type: String, required: true },
    items: { type: Number, default: 0 },
    image: {
      type: String,
      required: true,
      default: "/images/logos/category.svg",
    },
  },
  {
    timestamps: true,
    strict: false,
    strictQuery: true,
  }
);
const blogsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    body: { type: String, required: true },
    image: { type: String, require: true },
    author: { type: String, required: true },
    author_id: { type: String, required: true },
    views: { type: Number, default: 1 },
    fans: { type: Number, default: 1 },
    is_new: { type: Boolean, default: true },
    readTime: { type: Number, default: 10, required: false },
    keywords: { type: String, required: true },
    tags: { type: String, required: true },
    category: { type: String, required: true, default: "others" },
    slug: { type: String, required: true, unique: true },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    strict: false,
    strictQuery: true,
  }
);
export const Departments: any =
  mongoose.models.Departments ||
  mongoose.model("departments", DepartmentSchema);
export const Faculties: any =
  mongoose.models.Faculties || mongoose.model("faculties", FacultiesSchema);
export const blogsModel: any =
  mongoose.models.blogs || mongoose.model("blogs", blogsSchema);
export const Categories: any =
  mongoose.models.categories || mongoose.model("categories", categoriesSchema);
export const reviewsModel: any =
  mongoose.models.reviews || mongoose.model("reviews", reviewsSchema);
export const Users: any =
  mongoose.models.users || mongoose.model("users", usersSchema);
export const Announcments: any =
  mongoose.models.announcments ||
  mongoose.model("announcments", AnnouncmentsSchema);
export const Settings: any =
  mongoose.models.settings || mongoose.model("settings", SettingsSchema);
export const Admin: any =
  mongoose.models.admins || mongoose.model("admins", AdminSchema);
