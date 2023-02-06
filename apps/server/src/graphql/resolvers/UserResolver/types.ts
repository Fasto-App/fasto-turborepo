import { Privileges } from "../../../models/types";
import { z } from "zod";

export const CreateUser = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
  passwordConfirmation: z.string(),
  privileges: z.nativeEnum(Privileges).optional(),
});

export type CreateUserInput = z.infer<typeof CreateUser>;

export const UpdateUser = z.object({
  _id: z.string().optional(),
  name: z.string().optional(),
  email: z.string().optional(),
  password: z.string().optional(),
  passwordConfirmation: z.string().optional(),
});

export type UpdateUserInput = z.infer<typeof UpdateUser>;