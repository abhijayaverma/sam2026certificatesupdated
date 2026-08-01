import { NextRequest, NextResponse } from 'next/server';
import { adminClient } from '@/lib/supabase';
import { ensureRouteAdmin } from '@/lib/route-auth';
import { paginationSchema } from '@/utils/validation';
export async function GET(req: NextRequest) { const unauthorized = await ensureRouteAdmin(); if (unauthorized) return unauthorized; const { page, pageSize } = paginationSchema.parse(Object.fromEntries(req.nextUrl.searchParams)); const from = (page - 1) * pageSize; const { data, count, error } = await adminClient().from('downloads').select('*, participants(name, roll_number)', { count: 'exact' }).order('download_time', { ascending: false }).range(from, from + pageSize - 1); if (error) return NextResponse.json({ error: error.message }, { status: 500 }); return NextResponse.json({ data, count, page, pageSize }); }
