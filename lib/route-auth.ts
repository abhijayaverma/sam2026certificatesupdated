import { NextResponse } from 'next/server';
import { serverAuthClient } from '@/lib/auth';
export async function ensureRouteAdmin(){
  const supabase = await serverAuthClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return null;
}
