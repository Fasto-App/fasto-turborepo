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
import { useUploadFileMutation } from '../../gen/generated';
import { ControlledForm, RegularInputConfig } from '../../components/ControlledForm/ControlledForm';
import { UseFormHandleSubmit, UseFormSetValue } from 'react-hook-form';
import { useTranslation } from 'next-i18next';

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

	const [uploadFile] = useUploadFileMutation({
		onCompleted: (data) => {
			console.log(data)
		},
		onError: (error) => {
			console.log(error)
		}
	})

	const isEditing = !!productId

	const { allCategories } = useCategoryMutationHook()
	const {
		deleteProduct,
		updateProduct,
		createProduct
	} = useProductMutationHook()

	const closeModalAndClearQueryParams = () => {
		setShowModal(false)
		setProduct(null)
		resetAll()
		resetProduct()
	}

	const deleteProductCb = () => {

		if (!productId) return


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
						file: values.file,
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
						file: values.file,
						category: values.category
					},
				},
			});
		}

		closeModalAndClearQueryParams();
	};


	const handleFileUpload = async (evt: any) => {

		try {
			const { data } = await uploadFile({
				variables: {
					file: evt.target.files[0]
				}
			})

			setProductValue('file', data?.uploadFile)
		} catch { }
	}

	const ProductFormConfig: RegularInputConfig = {
		name: {
			isRequired: true,
			name: 'name',
			label: t("dishesProducts"),
			placeholder: t("dishesProducts"),
			helperText: t("productsHelperText"),
		},
		price: {
			isRequired: true,
			name: 'price',
			label: t("price"),
			placeholder: t("pricePlaceholder"),
			helperText: t("productsHelperText"),
			inputType: "Currency",
		},
		category: {
			isRequired: true,
			name: 'category',
			label: t("category"),
			placeholder: t("category"),
			helperText: t("productsHelperText"),
			inputType: 'Select',
			array: allCategories.map(cat => ({ name: cat.name, _id: cat._id })) ?? []
		},
		description: {
			name: 'description',
			label: t("description"),
			placeholder: t("description"),
			helperText: t("descriptionHelperText"),
			inputType: 'TextArea'
		},
		file: {
			name: 'file',
			label: t("photo"),
			placeholder: t("photo"),
			helperText: t("productsHelperText"),
			inputType: 'File',
			handleOnChange: handleFileUpload,
		}
	}


	return (
		<>
			<Modal isOpen={showModal} onClose={closeModalAndClearQueryParams}>
				<DevTool control={productControl} />
				<Modal.Content maxWidth="400px">
					<Modal.CloseButton />
					<Modal.Header>{isEditing ? t("editTitle") : t("addTitle")}</Modal.Header>
					<Modal.Body>
						<ControlledForm
							control={productControl}
							formState={productFormState}
							Config={ProductFormConfig}
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
								{isEditing ? t("edit") : t("create")}
							</Button>
						</Button.Group>
					</Modal.Footer>
				</Modal.Content>
			</Modal>
		</>
	);
};

// TODO: extract into it's own component

export { ProductModal };
