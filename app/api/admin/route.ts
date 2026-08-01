import { NextResponse } from 'next/server';
import { adminClient } from '@/lib/supabase';
import { ensureRouteAdmin } from '@/lib/route-auth';
export async function GET() { const unauthorized = await ensureRouteAdmin(); if (unauthorized) return unauthorized; const s = adminClient(); const [{ count: total }, { count: downloads }] = await Promise.all([s.from('participants').select('*', { count: 'exact', head: true }), s.from('downloads').select('*', { count: 'exact', head: true }).eq('status', 'success')]); return NextResponse.json({ totalParticipants: total ?? 0, certificatesDownloaded: downloads ?? 0, pendingDownloads: Math.max((total ?? 0) - (downloads ?? 0), 0) }); }
