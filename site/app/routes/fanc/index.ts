import { redirect } from "@remix-run/node";
import { route } from "routes-gen";

export const loader = () => {
  return redirect(route("/fanc/:page", { page: "1" }));
};
