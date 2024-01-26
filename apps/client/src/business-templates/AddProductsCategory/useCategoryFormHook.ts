import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const categorySchema = z.object({
	_id: z.string().optional(),
	categoryName: z.string().min(2, "error.nameRequired"),
});

export type CategoryFields = z.infer<typeof categorySchema>;

export const useCategoryFormHook = () => {
	const {
		control: categoryControl,
		handleSubmit: handleCategorySubmit,
		reset: resetCategoryForm,
		setValue: setCategoryValue,
		clearErrors: clearCategoryErrors,
		formState: categoryFormState,
	} = useForm({
		defaultValues: {
			_id: "",
			categoryName: "",
		},
		resolver: zodResolver(categorySchema),
	});

	return {
		categoryControl,
		categoryFormState,
		clearCategoryErrors,
		resetCategoryForm,
		handleCategorySubmit,
		setCategoryValue,
	};
};
