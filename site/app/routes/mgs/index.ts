import { redirect } from "@remix-run/node";
import { route } from "routes-gen";

export const loader = () => {
  return redirect(route("/mgs/:page", { page: "1" }));
};
