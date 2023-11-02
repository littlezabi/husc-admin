import { authenticateAdmin } from "$lib/users";
import { handleDepartment } from "../set-items/set-items";
import { handleFaculty, updateSettings } from "./handlers";
export const POST = async ({ request, cookies }: any) => {
  let authenticated = await authenticateAdmin(cookies.get("admin"));
  if (!authenticated) {
    cookies.delete("admin");
    return new Response(
      JSON.stringify({
        message: "Admin Authentication Failed!",
        success: 0,
        error: "unauthenticated_user",
      })
    );
  }
  let requestingFor = request.headers.get("requestFor");
  if (requestingFor === "updateSettings")
    return updateSettings(await request.json());
  else if (requestingFor === "department-edit")
    return handleDepartment(await request.formData(), 'edit')
  else if (requestingFor === "faculty-edit")
    return handleFaculty(await request.formData(), 'edit');
  else {
    return new Response(
      JSON.stringify({
        message: "API working but request data not found!",
        status: 0,
      }),
      { status: 200 }
    );
  }
};
