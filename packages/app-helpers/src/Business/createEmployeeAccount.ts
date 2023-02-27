import { z } from "zod";

export const createEmployeeAccountSchema = z.object({
  name: z.string().min(3).max(50, { message: 'Name must be more than 3 and less than 50 characters' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  passwordConfirmation: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  token: z.string().optional(),
  email: z.string().email().optional(),
}).superRefine((data, ctx) => {
  if (data.password !== data.passwordConfirmation) {
    ctx.addIssue({
      code: 'custom',
      message: 'Passwords do not match',
      path: ['passwordConfirmation'],
    });
  }
  return data;
});

export type CreateEmployeeAccountInput = z.infer<typeof createEmployeeAccountSchema>