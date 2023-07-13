import { z } from 'zod';

export const newTabSchema = z.object({
  name: z.string().min(3, { message: 'error.nameRequired' }),
  phoneNumber: z.string().min(6, { message: 'error.required' }),
  totalGuests: z.string().min(1, { message: 'error.required' }),
}).passthrough();

export const joinTabSchema = z.object({
  name: z.string().min(3, { message: 'error.nameRequired' }),
  phoneNumber: z.string().min(6, { message: 'error.required' }),
})

export type NewTabForm = z.infer<typeof newTabSchema>
export type JoinTabForm = z.infer<typeof joinTabSchema>