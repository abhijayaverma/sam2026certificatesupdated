import { NextRequest, NextResponse } from 'next/server';
import { adminClient } from '@/lib/supabase';
import { ensureRouteAdmin } from '@/lib/route-auth';
import { nameSchema, rollSchema } from '@/utils/validation';

export async function POST(req: NextRequest) {
  const unauthorized = await ensureRouteAdmin();
  if (unauthorized) return unauthorized;

  const body = await req.json().catch(() => null);
  const roll = rollSchema.safeParse(body?.rollNumber);
  const name = nameSchema.safeParse(body?.name);

  if (!roll.success || !name.success) {
    return NextResponse.json({ error: 'Enter a valid roll number and participant name.' }, { status: 400 });
  }

  const { data, error } = await adminClient()
    .from('participants')
    .upsert({ roll_number: roll.data, name: name.data }, { onConflict: 'roll_number' })
    .select('id, roll_number, name, created_at')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ participant: data });
}

export async function DELETE(req: NextRequest) {
  const unauthorized = await ensureRouteAdmin();
  if (unauthorized) return unauthorized;

  const body = await req.json().catch(() => null);
  const roll = rollSchema.safeParse(body?.rollNumber);

  if (!roll.success) {
    return NextResponse.json({ error: 'Enter a valid roll number to remove.' }, { status: 400 });
  }

  const { error, count } = await adminClient()
    .from('participants')
    .delete({ count: 'exact' })
    .eq('roll_number', roll.data);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!count) return NextResponse.json({ error: 'No participant found for that roll number.' }, { status: 404 });

  return NextResponse.json({ removed: roll.data });
}
