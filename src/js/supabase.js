import { createClient } from "@supabase/supabase-js";

// Lee de .env (VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY), con respaldo
// a los valores directos para que `npm run dev` funcione sin .env.
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://nyepdzvaaupfbbxuenil.supabase.co";
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_7f6UeGU-m2Pk7iiZqAv76g_NTDJbZHL";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    "Error: Las variables de entorno de Supabase no están configuradas en .env",
  );
}

// Se exportan ambos nombres para compatibilidad:
// registro.js usa `supabase`, login.js y auth-ui.js usan `supabaseClient`.
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export const supabaseClient = supabase;
