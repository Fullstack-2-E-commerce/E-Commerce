import { createClient } from "@supabase/supabase-js";
<<<<<<< Updated upstream

const SUPABASE_URL = "https://nyepdzvaaupfbbxuenil.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_7f6UeGU-m2Pk7iiZqAv76g_NTDJbZHL";

export const supabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
);
=======

// Lectura de variables de entorno desde .env.local
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validación opcional para alertas en consola durante desarrollo
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    " Error: Las variables de entorno de Supabase no están configuradas en .env.local",
  );
}

// Exportación nombrada para poder hacer: import { supabase } from "./supabase.js";
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
>>>>>>> Stashed changes
