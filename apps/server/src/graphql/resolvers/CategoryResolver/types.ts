import { z } from "zod";

export const CreateCategory = z.object({
  name: z.string(),
  description: z.string(),
  parentCategory: z.string().optional(),
  subCategories: z.array(z.string()).optional(),
});

export type CreateCategoryInput = z.infer<typeof CreateCategory>;


export const UpdateCategory = z.object({
  _id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  parentCategory: z.string().optional(),
  subCategories: z.array(z.string()).optional(),
});

export type UpdateCategoryInput = z.infer<typeof UpdateCategory>;