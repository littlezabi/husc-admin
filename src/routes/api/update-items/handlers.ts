import {
  Settings,
  Categories,
  Faculties,
} from "$lib/models";
import mongoose from "mongoose";
import getResponse from "../responses";

export const handleFaculty = async (formData: any, action = "edit") => {
  try {
    const form = Object.fromEntries(formData);
    const dataframe = JSON.parse(form.df);
    const info = JSON.parse(form.info);
    if (
      await Faculties.findOne(
        action === "new"
          ? { slug: dataframe.slug }
          : {
              slug: dataframe.slug,
              _id: { $ne: new mongoose.Types.ObjectId(dataframe._id) },
            },
        { _id: 1 }
      )
    )
      return getResponse(4);
    if (action === "edit") {
      delete dataframe._id;
      const saved = await Faculties.updateOne(
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
    try {
      const modal = new Faculties(dataframe);
      await modal.save();
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

export const updateSettings = async (jsonRequest: any) => {
  await Settings.updateOne(
    { _id: jsonRequest.id },
    { $set: jsonRequest.settings }
  );
  return new Response(JSON.stringify({ request: jsonRequest }), {
    status: 200,
  });
};
