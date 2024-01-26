import { z } from "zod";

export const CreateUser = z.object({
	name: z.string(),
	email: z.string(),
	password: z.string(),
	passwordConfirmation: z.string(),
});

export type CreateUserInput = z.infer<typeof CreateUser>;
