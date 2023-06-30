import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from 'zod';

// PRODUCT FORM STATE
const productSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(3, { message: 'Name Required' }),
  price: z.number().min(1, { message: 'Price Required' }),
  category: z.string().min(1, { message: 'Category Required' }),
  file: z.string().optional().nullable(),
  description: z.string().optional()
});

export type ProductFields = z.infer<typeof productSchema>;

export const useProductFormHook = () => {

  const {
    reset: resetProductForm,
    control: productControl,
    formState: productFormState,
    handleSubmit: handleProductSubmit,
    setValue: setProductValue,
    reset: resetProduct,
  } = useForm<ProductFields>({
    defaultValues: {
      _id: '',
      name: '',
      category: '',
      description: '',
      price: 0,
      file: undefined,
    },
    resolver: zodResolver(productSchema),
  });

  return {
    resetProductForm,
    productControl,
    productFormState,
    handleProductSubmit,
    setProductValue,
    resetProduct,
  }
}

