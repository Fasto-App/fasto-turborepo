import { z } from "zod";

export const CreateProduct = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  category: z.string(),
  addons: z.array(z.string()).optional(),
  file: z.instanceof(FileList)
});

export type CreateProductInput = z.infer<typeof CreateProduct>;
