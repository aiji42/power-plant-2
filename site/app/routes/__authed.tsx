import { LoaderFunction } from "@remix-run/node";
import { supabaseStrategy } from "~/libs/auth/auth.server";
import { Outlet } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }) => {
  await supabaseStrategy.checkSession(request, {
    failureRedirect: "/login",
  });

  return null;
};

export default function Layout() {
  return <Outlet />;
}
