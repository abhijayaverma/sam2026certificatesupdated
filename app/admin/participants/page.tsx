import { AdminShell } from '@/components/AdminShell';
import { ParticipantManager } from '@/components/ParticipantManager';
import { requireAdmin } from '@/lib/auth';
import { adminClient } from '@/lib/supabase';

export default async function Participants() {
  await requireAdmin();

  const { data } = await adminClient()
    .from('participants')
    .select('id, roll_number, name, created_at')
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <AdminShell>
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">Manage eligibility</p>
          <h1 className="text-4xl font-black">Participants</h1>
        </div>
        <p className="max-w-xl text-sm text-slate-600">
          Add a single student manually, update an existing student by reusing the same roll number, or remove students who are no longer eligible.
        </p>
      </div>
      <ParticipantManager participants={data ?? []} />
    </AdminShell>
  );
}
