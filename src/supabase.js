
import { createClient } from "@supabase/supabase-js";

// This URL is perfectly configured to point to your project
const supabaseUrl = "https://yjuqffkpgfdptzyzziuj.supabase.co";

// Paste your copied key right inside these quotes
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqdXFmZmtwZ2ZkcHR6eXp6aXVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNjE3MDMsImV4cCI6MjA5NjgzNzcwM30.UoHOsKA2qI3N7h-AfvSs_pSrPB7teM_pM_fVTSmPsaE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey)