import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { redirect } from 'next/navigation';
import { env } from '@/lib/env';
export async function serverAuthClient(){ const store=await cookies(); return createServerClient(env.supabaseUrl, env.supabaseAnonKey,{cookies:{getAll:()=>store.getAll(),setAll:(cs)=>cs.forEach(c=>store.set(c.name,c.value,c.options))}}); }
export async function requireAdmin(){ const supabase=await serverAuthClient(); const {data:{user}}=await supabase.auth.getUser(); if(!user) redirect('/admin/login'); return user; }
