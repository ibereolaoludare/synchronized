import { createClient } from "@supabase/supabase-js";
import { Database } from "./supabase-types";

const supabaseUrl: string = import.meta.env.SUPABASE_URL;
const supabaseKey: string = import.meta.env.SUPABASE_ANON_KEY;

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export default supabase;