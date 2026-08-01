import { z } from 'zod';
export const rollSchema = z.string().trim().min(2).max(64).regex(/^[A-Za-z0-9\-_/]+$/, 'Use a valid roll number');
export const nameSchema = z.string().trim().min(2).max(160).regex(/^[\p{L} .'-]+$/u, 'Use a valid participant name');
export const paginationSchema = z.object({ page: z.coerce.number().int().min(1).default(1), pageSize: z.coerce.number().int().min(1).max(100).default(20) });
