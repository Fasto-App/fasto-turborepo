import React, { useCallback, useMemo } from 'react';
import {
	Button,
	Modal
} from 'native-base';
import { DeleteAlert } from '../../components/DeleteAlert';
import { useCategoryMutationHook } from '../../graphQL/CategoryQL';
import { useAppStore } from '../UseAppStore';
import { GetProductValues, ProductFields } from './useProductFormHook';
import { DevTool } from "@hookform/devtools";
import { ControlledForm, SideBySideInputConfig } from '../../components/ControlledForm/ControlledForm';
import { UseFormHandleSubmit, UseFormSetValue } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { useUploadFileHook } from '../../hooks';
import { ControlledInput, InputProps } from '../../components/ControlledForm';
import {
	useCreateProductMutation,
	GetAllProductsByBusinessIdDocument,
	useDeleteProductMutation,
	useUpdateProductByIdMutation
} from "../../gen/generated";
import { showToast } from '../../components/showToast';

type ProductModalProps = {
	showModal: boolean,
	setShowModal: (value: boolean) => void,
	resetAll: () => void,
	handleProductSubmit: UseFormHandleSubmit<ProductFields>,
	productFormState: any,
	productControl: any,
	setProductValue: UseFormSetValue<ProductFields>,
	resetProduct: () => void,
	getProductValues: GetProductValues
}

const ProductModal = ({
	showModal,
	setShowModal,
	resetAll,
	handleProductSubmit,
	productFormState,
	productControl,
	resetProduct,
	setProductValue,
	getProductValues
}: ProductModalProps) => {
	const productId = useAppStore(state => state.product)
	const setProduct = useAppStore(state => state.setProduct)

	const { t } = useTranslation("businessCategoriesProducts");

	const { imageFile, imageSrc, handleFileOnChange } = useUploadFileHook()

	const isEditing = !!productId

	const { allCategories } = useCategoryMutationHook()

	const [createProduct,
		{
			loading: createProductIsLoading,
		}
	] = useCreateProductMutation({
		onCompleted: () => {
			showToast({
				message: t("productCreated"),
			})

		},
		onError: () => {
			showToast({
				status: "error",
				message: t('productCreatedError'),
			})
		},
		refetchQueries: [GetAllProductsByBusinessIdDocument]
	});

	const [updateProduct,
		{ loading: updateProductIsLoading }] =
		useUpdateProductByIdMutation({
			onCompleted: () => {
				showToast({
					message: t("productUpdated"),
				})
			},
			onError: () => {
				showToast({
					status: "error",
					message: t("productUpdatedError"),
				})
			},
			refetchQueries: [GetAllProductsByBusinessIdDocument]
		});

	const [deleteProduct, {
		loading: deleteProductIsLoading,
	}] = useDeleteProductMutation({
		onCompleted: () => {
			showToast({
				message: t('productDeleted')
			})
		},
		onError: () => {
			showToast({
				status: "error",
				message: t('productDeletedError')
			})
		},
		refetchQueries: [GetAllProductsByBusinessIdDocument]
	});

	const closeModalAndClearQueryParams = () => {
		handleFileOnChange(null)
		setShowModal(false)
		setProduct(null)
		resetAll()
		resetProduct()
	}

	const deleteProductCb = () => {

		if (!productId) throw new Error("No product id")


		deleteProduct({
			variables: {
				id: productId
			}
		})

		closeModalAndClearQueryParams()
	}

	const onProductSubmit = async (values: ProductFields) => {

		if (!!productId) {
			await updateProduct({
				variables: {
					input: {
						_id: productId,
						name: values.name,
						description: values.description,
						price: Number(values.price),
						file: imageFile,
						category: values.category,
						quantity: values.quantity,
						paused: values.paused,
						blockOnZeroQuantity: values.blockOnZeroQuantity
					}
				}
			});

		} else {

			await createProduct({
				variables: {
					input: {
						name: values.name,
						description: values.description,
						price: Number(values.price),
						file: imageFile,
						category: values.category,
						quantity: values.quantity,
						paused: values.paused,
						blockOnZeroQuantity: values.blockOnZeroQuantity
					},
				},
			});
		}

		closeModalAndClearQueryParams();
	};

	const handleSwitch = useCallback(() => {
		setProductValue('paused', !getProductValues("paused"))
	}, [getProductValues, setProductValue])

	// @ts-ignore
	const ProductFormConfig: SideBySideInputConfig = useMemo(() => ({
		paused: {
			name: 'paused',
			label: "Pause Item",
			inputType: 'Switch',
			handleOnChange: handleSwitch
		},
		nameAndCategory: [{
			name: {
				isRequired: true,
				name: 'name',
				label: t("dishesProducts"),
				placeholder: t("dishesProducts"),

			}
		}, {
			category: {
				isRequired: true,
				name: 'category',
				label: t("category"),
				placeholder: t("category"),
				inputType: 'Select',
				array: allCategories.map(cat => ({ name: cat.name, _id: cat._id })) ?? []
			}
		}],
		priceAndQuantity: [{
			price: {
				isRequired: true,
				name: 'price',
				label: t("price"),
				placeholder: t("pricePlaceholder"),
				inputType: "Currency",
			},
		},
		{
			quantity: {
				name: 'quantity',
				label: t("quantity"),
				placeholder: t("quantity"),
				inputType: "Number",
			},
		}],
		description: {
			name: 'description',
			label: t("description"),
			placeholder: t("description"),
			inputType: 'TextArea'
		}
	}), [allCategories, handleSwitch, t])

	const uploadPicture: InputProps = useMemo(() => ({
		name: 'file',
		label: t("photo"),
		placeholder: t("photo"),
		inputType: 'File',
	}), [t])

	return (
		<>
			<Modal isOpen={showModal} onClose={closeModalAndClearQueryParams} size={"lg"} height={"full"}>
				<DevTool control={productControl} />
				<Modal.Content>
					<Modal.CloseButton />
					<Modal.Header>{isEditing ? t("editTitle") : t("addTitle")}</Modal.Header>
					<Modal.Body>
						<ControlledInput
							{...uploadPicture}
							name='file'
							handleOnChange={handleFileOnChange}
							src={imageSrc}
							control={productControl}
							label={t("uploadPicture")}
						/>
						<ControlledForm
							control={productControl}
							formState={productFormState}
							Config={ProductFormConfig}
						/>
						{isEditing ?
							<DeleteAlert
								deleteItem={deleteProductCb}
								title={t("delete")}
								body={t("deleteProductBody")}
								cancel={t("cancel")}
							/> : null}
					</Modal.Body>

					<Modal.Footer borderColor={"white"}>
						<Button.Group space={2} flex={1}>
							<Button
								flex={1}
								isLoading={createProductIsLoading || updateProductIsLoading || deleteProductIsLoading}
								w={"100px"}
								variant="outline"
								colorScheme="tertiary"
								onPress={closeModalAndClearQueryParams}>
								{t("cancel")}
							</Button>
							<Button
								flex={1}
								isLoading={createProductIsLoading || updateProductIsLoading || deleteProductIsLoading}
								w={"100px"} onPress={handleProductSubmit(onProductSubmit)}>
								{isEditing ? t("save") : t("create")}
							</Button>
						</Button.Group>
					</Modal.Footer>
				</Modal.Content>
			</Modal>
		</>
	);
};

export { ProductModal };
