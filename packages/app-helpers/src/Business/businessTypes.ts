import { z } from "zod";
import { typedKeys } from "../utils";
import { PrivilegesKeysArray } from "./privileges";

const DaysOfWeek = {
  Monday: "Monday",
  Tuesday: "Tuesday",
  Wednesday: "Wednesday",
  Thursday: "Thursday",
  Friday: "Friday",
  Saturday: "Saturday",
  Sunday: "Sunday",
} as const;

export const DaysOfTheWeekArray = typedKeys(DaysOfWeek);

export type DaysOfWeekType = typeof DaysOfWeek[keyof typeof DaysOfWeek];

export const businessLocationSchema = z.object({
  streetAddress: z.string().trim().min(3, { message: 'Name Required' }),
  complement: z.string(),
  postalCode: z.string().trim().min(4, { message: 'Zip/Postal Code Required' }),
  city: z.string().trim().min(2, { message: 'City Required' }),
  stateOrProvince: z.string().trim().min(2, { message: 'State Required' }),
  country: z.string().trim().min(2, { message: 'Country Required' }),
});

export type businessLocationSchemaInput = z.infer<typeof businessLocationSchema>
export type businessLocationSchemaInputKeys = keyof businessLocationSchemaInput

export const businessInformationSchema = z.object({
  name: z.string().trim().min(3, { message: 'Name Required' }),
  description: z.string().trim().optional(),
  picture: z.string().optional(),
});

export type businessInformationSchemaInput = z.infer<typeof businessInformationSchema>

export const hoursOfOperationSchema = z.record(z.nativeEnum(DaysOfWeek), z.object({
  isOpen: z.boolean(),
  hours: z.object({
    open: z.string(),
    close: z.string(),
  }).optional(),
})).refine((data) => {
  const invalidDays = Object.entries(data).filter(([day, hours]) => {
    return hours.isOpen && (!hours.hours || !hours.hours.open || !hours.hours.close)
  })

  return invalidDays.length === 0
}, { message: 'Hours of operation must have opening and close time.' });



export type HoursOfOperationType = z.infer<typeof hoursOfOperationSchema>


export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
});


export type forgotPasswordSchemaInput = z.infer<typeof forgotPasswordSchema>

export const loginSchema = z.object({
  email: z.string().email({ message: 'error.email' }),
  password: z.string().min(6, { message: 'error.password' }),
});

export type loginSchemaInput = z.infer<typeof loginSchema>


export const menuSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name Required" })
    .max(50, { message: "Name too long" }),
});

export type menuSchemaInput = z.infer<typeof menuSchema>

export const resetPasswordSchema = z.object({
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  passwordConfirmation: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  token: z.string().optional(),
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

export type ResetPasswordSchemaInput = z.infer<typeof resetPasswordSchema>

export const signUpSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
});

export type SignUpSchemaInput = z.infer<typeof signUpSchema>

export type CreateAccountField = z.infer<typeof createAccountSchema>

export const createAccountSchema = z.object({
  email: z.string().email(),
  name: z.string().min(3).max(50),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }).max(50),
  passwordConfirmation: z.string().min(6, { message: 'Password must be at least 6 characters' }).max(50),
}).superRefine((data, ctx) => {
  if (data.password !== data.passwordConfirmation) {
    ctx.addIssue({
      code: 'custom',
      message: 'Passwords do not match',
      path: ['passwordConfirmation'],
    });
  }
  return data;
})


export const accountInformationFormSchema = z.object({
  name: z.string().trim().min(3, { message: 'Name Required' })
    .max(50, { message: 'Name too long' }),
  email: z.string().trim().min(4, { message: 'Email Required' }),
  oldPassword: z.string().optional(),
  newPassword: z.string().min(6, { message: 'Password must be at least 6 characters' }).optional().or(z.literal('')),
  newPasswordConfirmation: z.string().min(6, { message: 'Password must be at least 6 characters' }).optional().or(z.literal('')),
}).superRefine((data, ctx) => {
  if (data.newPassword !== data.newPasswordConfirmation) {
    ctx.addIssue({
      code: 'custom',
      message: 'Passwords do not match',
      path: ['newPasswordConfirmation'],
    });
  }

  if (data.oldPassword && !data.newPassword) {
    ctx.addIssue({
      code: 'custom',
      message: 'New password required',
      path: ['newPassword'],
    });
  }

  if (data.newPassword && !data.oldPassword) {
    ctx.addIssue({
      code: 'custom',
      message: 'Old password required',
      path: ['oldPassword'],
    });
  }

  return data;
})

export type AccountInformation = z.infer<typeof accountInformationFormSchema>

export const employeeFormSchema = z.object({
  _id: z.string().optional(),
  name: z.string().trim().min(3, { message: 'Name Required' })
    .max(50, { message: 'Name too long' }),
  jobTitle: z.string().trim().min(3, { message: 'Job Role Required' }),
  privilege: z.enum(PrivilegesKeysArray),
  email: z.string().email().min(4, { message: 'Email Required' }),
  isPending: z.boolean().optional(),
})

export type EmployeeInformation = z.infer<typeof employeeFormSchema>

