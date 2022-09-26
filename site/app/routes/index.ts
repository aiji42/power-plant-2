import { LoaderFunction, redirect } from "@remix-run/node";
import { supabaseStrategy } from "~/libs/auth/auth.server";
import { route } from "routes-gen";

export const loader: LoaderFunction = async ({ request }) => {
  await supabaseStrategy.checkSession(request, {
    failureRedirect: route("/login"),
  });

  return redirect(route("/mgs/:page", { page: "1" }));
};
