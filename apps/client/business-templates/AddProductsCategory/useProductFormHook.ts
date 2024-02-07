import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormGetValues, useForm } from "react-hook-form";
import * as z from 'zod';

// PRODUCT FORM STATE
const productSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(3, { message: 'error.nameRequired' }),
  price: z.number().min(1, { message: 'error.required' }),
  category: z.string().min(1, { message: 'error.required' }),
  file: z.string().optional().nullable(),
  description: z.string().optional(),
  quantity: z.number().optional(),
  paused: z.boolean(),
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
    getValues: getProductValues,
  } = useForm<ProductFields>({
    defaultValues: {
      _id: '',
      name: '',
      category: '',
      description: '',
      price: 0,
      file: undefined,
      quantity: undefined,
      paused: false,
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
    getProductValues,
  }
}

export type GetProductValues = UseFormGetValues<ProductFields>
