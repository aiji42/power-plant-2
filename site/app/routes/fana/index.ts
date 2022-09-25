import { redirect } from "@remix-run/node";
import { route } from "routes-gen";

export const loader = () => {
  return redirect(route("/fana/:page", { page: "1" }));
};
