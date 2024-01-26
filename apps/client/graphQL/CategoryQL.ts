import { useTranslation } from "next-i18next";
import { showToast } from "../components/showToast";
import {
	GetAllCategoriesByBusinessDocument,
	GetAllProductsByBusinessIdDocument,
	useCreateCategoryMutation,
	useDeleteCategoryMutation,
	useGetAllCategoriesByBusinessQuery,
	useUpdateCategoryMutation,
} from "../gen/generated";

export const useCategoryMutationHook = () => {
	const { data: allCategories, loading: getCategoriesIsLoading } =
		useGetAllCategoriesByBusinessQuery();

	const { t } = useTranslation("businessCategoriesProducts");

	const [
		createCategory,
		{
			data: categoryCreated,
			loading: createCategoryIsLoading,
			error: isCategoryError,
			reset: resetCreateCategories,
		},
	] = useCreateCategoryMutation({
		onCompleted: () => {
			showToast({
				message: t("categoryCreated"),
			});
		},
		onError: () => {
			showToast({
				status: "error",
				message: t("categoryCreatedError"),
			});
		},
		update: (cache, { data }) => {
			// @ts-ignore
			const { getAllCategoriesByBusiness } = cache.readQuery({
				query: GetAllCategoriesByBusinessDocument,
			});

			cache.writeQuery({
				query: GetAllCategoriesByBusinessDocument,
				data: {
					getAllCategoriesByBusiness: [
						data?.createCategory,
						...getAllCategoriesByBusiness,
					],
				},
			});
		},
	});

	const [
		updateCategory,
		{
			reset: resetUpdateCategory,
			data: categoryUpdated,
			error: isCategoryUpdatedError,
		},
	] = useUpdateCategoryMutation({
		onCompleted: () => {
			showToast({
				message: t("categoryUpdated"),
			});
		},
		onError: () => {
			showToast({
				status: "error",
				message: t("categoryUpdatedError"),
			});
		},
		update: (cache, { data }) => {
			// @ts-ignore
			const { getAllCategoriesByBusiness } = cache.readQuery({
				query: GetAllCategoriesByBusinessDocument,
			});

			cache.writeQuery({
				query: GetAllCategoriesByBusinessDocument,
				data: {
					getAllCategoriesByBusiness: getAllCategoriesByBusiness.map(
						(category: { _id: any }) => {
							if (category._id === data?.updateCategory?._id) {
								return updateCategory;
							}
							return category;
						},
					),
				},
			});
		},
	});

	const [
		deleteCategory,
		{ data: categoryDeleted, reset: resetDeleteCategory },
	] = useDeleteCategoryMutation({
		onCompleted: () => {
			showToast({
				message: t("categoryDeleted"),
			});
		},
		onError: (error) => {
			showToast({
				status: "error",
				message: t("categoryDeletedError"),
			});
		},
		refetchQueries: [
			GetAllCategoriesByBusinessDocument,
			GetAllProductsByBusinessIdDocument,
		],
	});

	return {
		allCategories: allCategories?.getAllCategoriesByBusiness || [],
		createCategory,
		categoryUpdated: categoryUpdated?.updateCategory,
		categoryDeleted,
		createCategoryIsLoading,
		deleteCategory,
		isCategoryUpdatedError,
		categoryError: isCategoryError?.message,
		getCategoriesIsLoading,
		loadingCategory: createCategoryIsLoading || getCategoriesIsLoading,
		categoryCreated,
		resetDeleteCategory,
		resetCreateCategories,
		resetUpdateCategory,
		updateCategory,
	};
};
