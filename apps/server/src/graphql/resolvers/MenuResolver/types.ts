import { z } from "zod";

const CreateMenu = z.object({
	name: z.string(),
});

const UpdateMenu = z.object({
	_id: z.string(),
	name: z.string(),
	isFavorite: z.boolean(),
	sections: z.array(
		z.object({
			category: z.string(),
			products: z.array(z.string()).optional(),
		}),
	),
});

export type CreateMenuInput = { input: z.infer<typeof CreateMenu> };
export type UpdateMenuInput = z.infer<typeof UpdateMenu>;
