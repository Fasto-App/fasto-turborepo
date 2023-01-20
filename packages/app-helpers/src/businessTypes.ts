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

export const businessInfoSchema = z.object({
  name: z.string().trim().min(3, { message: 'Name Required' }),
  streetName: z.string().trim().min(4, { message: 'Street Required' }),
  streetNumber: z.string(),
  zipCode: z.string().trim().min(4, { message: 'Zip/Postal Code Required' }),
  city: z.string().trim().min(2, { message: 'City Required' }),
  state: z.string().trim().min(2, { message: 'State Required' }),
  country: z.string().trim().min(2, { message: 'Country Required' }),
  // hoursOfOperation: z.record(z.nativeEnum(DaysOfWeek), z.object({
  //   open: z.string().regex(/^\d{2}:\d{2}$/, { message: 'Invalid time format' }),
  //   close: z.string().regex(/^\d{2}:\d{2}$/, { message: 'Invalid time format' }),
  // })),
  picture: z.string().optional(),
});

export type businessInfoSchemaInput = z.infer<typeof businessInfoSchema>
export type businessInfoSchemaInputKeys = keyof businessInfoSchemaInput

// type HousOfOperationObject = Pick<businessInfoSchemaInput, "hoursOfOperation">
// export type HousOfOperationType = HousOfOperationObject["hoursOfOperation"]
