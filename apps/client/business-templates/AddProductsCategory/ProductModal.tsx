import React from 'react';
import {
	Button,
	Modal
} from 'native-base';
import { DeleteAlert } from '../../components/DeleteAlert';
import { useCategoryMutationHook } from '../../graphQL/CategoryQL';
import { useProductMutationHook } from '../../graphQL/ProductQL';
import { useAppStore } from '../UseAppStore';
import { ProductFields } from './useProductFormHook';
import { DevTool } from "@hookform/devtools";
import { ControlledForm, RegularInputConfig } from '../../components/ControlledForm/ControlledForm';
import { UseFormHandleSubmit, UseFormSetValue } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { useUploadFileHook } from '../../hooks';
import { ControlledInput, InputProps } from '../../components/ControlledForm';

type ProductModalProps = {
	showModal: boolean,
	setShowModal: (value: boolean) => void,
	resetAll: () => void,
	handleProductSubmit: UseFormHandleSubmit<ProductFields>,
	productFormState: any,
	productControl: any,
	setProductValue: UseFormSetValue<ProductFields>,
	resetProduct: () => void,
}

const ProductModal = ({
	showModal,
	setShowModal,
	resetAll,
	handleProductSubmit,
	productFormState,
	productControl,
	setProductValue,
	resetProduct
}: ProductModalProps) => {
	const productId = useAppStore(state => state.product)
	const setProduct = useAppStore(state => state.setProduct)

	const { t } = useTranslation("businessCategoriesProducts");

	const { imageFile, imageSrc, handleFileOnChange } = useUploadFileHook()

	const isEditing = !!productId

	const { allCategories } = useCategoryMutationHook()
	const {
		deleteProduct,
		updateProduct,
		createProduct
	} = useProductMutationHook()

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

	const onProductSubmit = (values: ProductFields) => {
		console.log(values)

		if (!!productId) {
			updateProduct({
				variables: {
					input: {
						_id: productId,
						name: values.name,
						description: values.description,
						price: Number(values.price),
						file: imageFile,
						category: values.category
					}
				}
			});

		} else {

			createProduct({
				variables: {
					input: {
						name: values.name,
						description: values.description,
						price: Number(values.price),
						file: imageFile,
						category: values.category
					},
				},
			});
		}

		closeModalAndClearQueryParams();
	};

	const ProductFormConfig: RegularInputConfig = {
		name: {
			isRequired: true,
			name: 'name',
			label: t("dishesProducts"),
			placeholder: t("dishesProducts"),

		},
		price: {
			isRequired: true,
			name: 'price',
			label: t("price"),
			placeholder: t("pricePlaceholder"),

			inputType: "Currency",
		},
		category: {
			isRequired: true,
			name: 'category',
			label: t("category"),
			placeholder: t("category"),

			inputType: 'Select',
			array: allCategories.map(cat => ({ name: cat.name, _id: cat._id })) ?? []
		},
		description: {
			name: 'description',
			label: t("description"),
			placeholder: t("description"),

			inputType: 'TextArea'
		}
	}

	const uploadPicture: InputProps = {
		name: 'file',
		label: t("photo"),
		placeholder: t("photo"),
		inputType: 'File',
	}

	return (
		<>
			<Modal isOpen={showModal} onClose={closeModalAndClearQueryParams} size={"lg"}>
				<DevTool control={productControl} />
				<Modal.Content>
					<Modal.CloseButton />
					<Modal.Header>{isEditing ? t("editTitle") : t("addTitle")}</Modal.Header>
					<Modal.Body>
						<ControlledForm
							control={productControl}
							formState={productFormState}
							Config={ProductFormConfig}
						/>
						<ControlledInput
							{...uploadPicture}
							name='file'
							handleOnChange={handleFileOnChange}
							src={imageSrc}
							control={productControl}
							label={t("uploadPicture")}
						/>
						{isEditing ? <DeleteAlert deleteItem={deleteProductCb} title={t("delete")} /> : null}
					</Modal.Body>

					<Modal.Footer>
						<Button.Group space={2}>
							<Button w={"100px"} variant="ghost" colorScheme="tertiary" onPress={() => {
								closeModalAndClearQueryParams();
							}}>
								{t("cancel")}
							</Button>
							<Button w={"100px"} onPress={handleProductSubmit(onProductSubmit)}>
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
