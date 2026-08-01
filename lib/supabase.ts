import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';
import { env, assertServerEnv } from '@/lib/env';
export function adminClient(){ assertServerEnv(); return createClient(env.supabaseUrl, env.supabaseServiceKey, { auth: { persistSession: false } }); }
export function browserClient(){ return createBrowserClient(env.supabaseUrl, env.supabaseAnonKey); }
