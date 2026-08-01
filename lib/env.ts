export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
};
export function assertServerEnv() { for (const [k,v] of Object.entries(env)) if (!v) throw new Error(`Missing environment variable: ${k}`); }
