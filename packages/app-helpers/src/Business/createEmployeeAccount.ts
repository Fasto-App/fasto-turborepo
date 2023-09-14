import { z } from "zod";

export const createEmployeeAccountSchema = z.object({
  name: z.string().min(3).max(50, { message: 'error.nameRequired' }),
  password: z.string().min(6, { message: 'error.passwordMinimumLength' }),
  passwordConfirmation: z.string().min(6, { message: 'error.passwordConfirmation' }),
  token: z.string().optional(),
  email: z.string().email().optional(),
}).superRefine((data, ctx) => {
  if (data.password !== data.passwordConfirmation) {
    ctx.addIssue({
      code: 'custom',
      message: 'error.passwordsDontMatch',
      path: ['passwordConfirmation'],
    });
  }
  return data;
});

export type CreateEmployeeAccountInput = z.infer<typeof createEmployeeAccountSchema>