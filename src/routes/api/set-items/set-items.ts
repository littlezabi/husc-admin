import { Departments, Faculties } from "$lib/models";
import mongoose from "mongoose";
import getResponse from "../responses";

export const handleDepartment = async (formData: any, action = "edit") => {
  try {
    const form = Object.fromEntries(formData);
    const dataframe = JSON.parse(form.df);
    const info = JSON.parse(form.info);
    console.log(info)
    if (
      !dataframe.asDraft &&
      (await Departments.findOne(
        action === "new"
          ? { slug: dataframe.slug }
          : {
              slug: dataframe.slug,
              _id: { $ne: new mongoose.Types.ObjectId(dataframe._id) },
            },
        { _id: 1 }
      ))
    )
      return getResponse(4);
    if (action === "edit") {
      delete dataframe._id;
      if (info.new_faculty && info.new_faculty !== dataframe.faculty) {
        await Faculties.updateOne(
          { _id: dataframe.faculty },
          { $inc: { departments: -1 } }
        );
        await Faculties.updateOne(
          { _id: info.new_faculty },
          { $inc: { departments: 1 } }
        );
        dataframe.faculty = info.new_faculty;
      }
      if (info.new_faculty)
        dataframe.faculty = new mongoose.Types.ObjectId(
          info.new_faculty
        );
      const saved = await Departments.updateOne(
        { _id: info._id },
        {
          $set: { ...dataframe },
        }
      );
      if (saved)
        return new Response(JSON.stringify({ success: 1 }), { status: 200 });
      else
        return new Response(
          JSON.stringify({ message: "Failed to save!", success: 0 }),
          {
            status: 200,
          }
        );
    }
    if (info.new_faculty)
      dataframe.faculty = new mongoose.Types.ObjectId(info.new_faculty);
    try {
      const modal = new Departments(dataframe);
      await modal.save();
      if (dataframe.faculty)
        await Faculties.updateOne(
          { _id: dataframe.faculty },
          { $inc: { items: 1 } }
        );
      return getResponse(3, 200, 1);
    } catch (e: any) {
      return getResponse(undefined, 200, 0, {
        message: `Error: ${e.message}!`,
      });
    }
  } catch (e: any) {
    console.error(e);
    return getResponse(undefined, 200, 0, { message: `Error: ${e.message}!` });
  }
};
