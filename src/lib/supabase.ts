import { createClient } from "@supabase/supabase-js";
import { Database } from "./supabase-types";

const supabaseUrl: string = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseKey: string = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export default supabase;