export type Participant = { id: string; roll_number: string; name: string; created_at: string };
export type DownloadLog = { id: string; participant_id: string; download_time: string; ip: string | null; user_agent: string | null; status: string; participants?: Pick<Participant, 'name' | 'roll_number'> | null };
