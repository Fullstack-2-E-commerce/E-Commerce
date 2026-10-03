import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://nyepdzvaaupfbbxuenil.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_7f6UeGU-m2Pk7iiZqAv76g_NTDJbZHL";

export const supabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
);
