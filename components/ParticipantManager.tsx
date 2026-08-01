'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';

type Participant = {
  id: string;
  roll_number: string;
  name: string;
  created_at: string;
};

type Props = {
  participants: Participant[];
};

export function ParticipantManager({ participants }: Props) {
  const router = useRouter();
  const [rollNumber, setRollNumber] = useState('');
  const [name, setName] = useState('');
  const [pending, setPending] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);

  async function addParticipant(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);

    try {
      const response = await fetch('/api/participants', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ rollNumber, name }),
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'Unable to save participant.');

      toast.success('Participant saved');
      setRollNumber('');
      setName('');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to save participant.');
    } finally {
      setPending(false);
    }
  }

  async function removeParticipant(roll: string) {
    if (!window.confirm(`Remove participant with roll number ${roll}?`)) return;

    setRemoving(roll);

    try {
      const response = await fetch('/api/participants', {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ rollNumber: roll }),
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'Unable to remove participant.');

      toast.success('Participant removed');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to remove participant.');
    } finally {
      setRemoving(null);
    }
  }

  return (
    <div className="mt-6 space-y-6">
      <form onSubmit={addParticipant} className="grid gap-4 rounded-3xl bg-white p-5 shadow md:grid-cols-[1fr_1fr_auto]">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Roll Number</span>
          <input
            value={rollNumber}
            onChange={(event) => setRollNumber(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-blue-200 focus:ring-4"
            placeholder="220101001"
            required
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-blue-200 focus:ring-4"
            placeholder="Participant name"
            required
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="self-end rounded-2xl bg-blue-700 px-6 py-3 font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? 'Saving...' : 'Add Student'}
        </button>
      </form>

      <div className="overflow-hidden rounded-3xl bg-white shadow">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4">Roll Number</th>
              <th className="p-4">Name</th>
              <th className="p-4">Created</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((participant) => (
              <tr key={participant.id} className="border-t">
                <td className="p-4">{participant.roll_number}</td>
                <td className="p-4 font-semibold">{participant.name}</td>
                <td className="p-4">{new Date(participant.created_at).toLocaleString()}</td>
                <td className="p-4 text-right">
                  <button
                    type="button"
                    onClick={() => removeParticipant(participant.roll_number)}
                    disabled={removing === participant.roll_number}
                    className="rounded-xl border border-red-200 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {removing === participant.roll_number ? 'Removing...' : 'Remove'}
                  </button>
                </td>
              </tr>
            ))}
            {!participants.length && (
              <tr>
                <td className="p-8 text-center text-slate-500" colSpan={4}>
                  No participants yet. Add a student above or upload an Excel file.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
