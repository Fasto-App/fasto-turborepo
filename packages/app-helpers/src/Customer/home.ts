import { z } from 'zod';

export const newTabSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  phoneNumber: z.string().min(6, { message: 'Required' }),
  totalGuests: z.string().min(1, { message: 'Required' }),
}).passthrough();

export const joinTabSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  phoneNumber: z.string().min(6, { message: 'Required' }),
})

export type NewTabForm = z.infer<typeof newTabSchema>
export type JoinTabForm = z.infer<typeof joinTabSchema>