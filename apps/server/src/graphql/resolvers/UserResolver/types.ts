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