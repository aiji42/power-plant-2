import { createClient } from "@supabase/supabase-js";
export type { Session } from "@supabase/supabase-js";

export const supabaseClient = createClient(
  process.env.SUPABASE_ENDPOINT ?? "",
  process.env.SUPABASE_KEY ?? ""
);
