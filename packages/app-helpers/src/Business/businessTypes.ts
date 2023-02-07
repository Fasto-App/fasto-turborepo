import { z } from "zod";



const DaysOfWeek = {
  Monday: "Monday",
  Tuesday: "Tuesday",
  Wednesday: "Wednesday",
  Thursday: "Thursday",
  Friday: "Friday",
  Saturday: "Saturday",
  Sunday: "Sunday",
} as const;

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

export const businessInfoSchema = z.object({
  name: z.string().trim().min(3, { message: 'Name Required' }),
  description: z.string().trim().min(10, { message: 'Description Required' }),
  hoursOfOperation: z.record(z.nativeEnum(DaysOfWeek), z.object({
    open: z.string().regex(/^\d{2}:\d{2}$/, { message: 'Invalid time format' }),
    close: z.string().regex(/^\d{2}:\d{2}$/, { message: 'Invalid time format' }),
  })),
  picture: z.string().optional(),
});

export type businessInfoSchemaInput = z.infer<typeof businessInfoSchema>

type HoursOfOperationObject = Pick<businessInfoSchemaInput, "hoursOfOperation">
export type HoursOfOperationType = HoursOfOperationObject["hoursOfOperation"]


export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
});


export type forgotPasswordSchemaInput = z.infer<typeof forgotPasswordSchema>

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
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
});

export type resetPasswordSchemaInput = z.infer<typeof resetPasswordSchema>

export const signUpSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
});

export type SignUpSchemaInput = z.infer<typeof signUpSchema>

export type CreateAccountField = z.infer<typeof createAccountSchema>

export const createAccountSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(50),
  passwordConfirmation: z.string().min(8).max(50),
});