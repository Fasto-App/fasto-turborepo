import { z } from "zod";



// interface UpdateMenuInput {
//   _id: string;
//   name: string;
//   sections: {
//       category: string;
//       products?: string[];
//   }[]
// }

const UpdateMenu = z.object({
  _id: z.string(),
  name: z.string(),
  sections: z.array(
    z.object({
      category: z.string(),
      products: z.array(z.string()).optional(),
    })
  ),
});

export type UpdateMenuInput = z.infer<typeof UpdateMenu>;



