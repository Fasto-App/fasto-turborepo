import React from 'react';
import { Modal } from 'native-base';
import { Control, FormState, UseFormHandleSubmit } from 'react-hook-form';
import { DeleteAlert } from '../../components/DeleteAlert';
import { useCategoryMutationHook } from '../../graphQL/CategoryQL';
import { useAppStore } from '../UseAppStore';
import { ControlledForm } from '../../components/ControlledForm/ControlledForm';
import { CategoryFields } from './useCategoryFormHook';
import { ModalAddButtons } from '../ModalButtons';

type CategoriesModalProps = {
	showModal: boolean,
	setShowModal: (val: boolean) => void,
	categoryControl: Control<CategoryFields>;
	categoryFormState: FormState<CategoryFields>;
	handleCategorySubmit: UseFormHandleSubmit<CategoryFields>;
	resetCategoryForm: () => void;
};

const texts = {
	addTitle: "Add New Category",
	editTitle: "Edit Category",
	dishesCategoriess: "Category name",
	categoriessHelperText: "Max 12 characters",
	description: "Description",
	descriptionHelperText: "Max 5 lines",
	add: "Add",
	delete: "Delete Category",
	cancel: "Cancel",
	save: "Save",
}

const CategoryModal = ({
	showModal,
	setShowModal,
	categoryControl,
	categoryFormState,
	handleCategorySubmit,
	resetCategoryForm
}: CategoriesModalProps) => {
	const setCategory = useAppStore(state => state.setCategory)
	const categoryId = useAppStore(state => state.category)
	const nameError = useAppStore(state => state.networkState === "error" ? state.networkState : "")
	const isEditing = !!categoryId

	const {
		updateCategory,
		createCategory,
		deleteCategory,
		categoryError,
	} = useCategoryMutationHook()

	const closeModalAndClearQueryParams = () => {
		setCategory(null)
		setShowModal(false)
		resetCategoryForm()
	}

	const onCategorySubmit = async (values: CategoryFields) => {
		console.log("onCategorySubmit", values)
		// if theres a categoryId, then we are updating a category
		if (values._id) {
			updateCategory({
				variables: {
					input: {
						_id: values._id,
						name: values.categoryName,
					}
				}
			});
		} else {

			createCategory({
				variables: {
					input: {
						name: values.categoryName,
					}
				}
			});
		}

		closeModalAndClearQueryParams()
	}

	const deleteCategoryCb = () => {
		closeModalAndClearQueryParams()
		deleteCategory({
			variables: {
				id: categoryId
			}
		})
	}

	return (
		<>
			<Modal isOpen={showModal} onClose={closeModalAndClearQueryParams}>
				<Modal.Content maxWidth="400px">
					<Modal.CloseButton />
					<Modal.Header>{isEditing ? texts.editTitle : texts.addTitle}</Modal.Header>
					<Modal.Body>
						{/* Name */}
						<ControlledForm
							control={categoryControl}
							formState={categoryFormState}
							Config={{
								categoryName: {
									name: "categoryName",
									label: texts.dishesCategoriess,
									placeholder: texts.dishesCategoriess,
									helperText: texts.categoriessHelperText,
								}
							}}
						/>
						{
							isEditing ? (<DeleteAlert
								deleteItem={() => {
									deleteCategoryCb()
									setShowModal(false)
								}}
								title={texts.delete}

							/>) : null}
					</Modal.Body>
					<Modal.Footer>
						<ModalAddButtons
							isEditing={isEditing}
							cancelAction={closeModalAndClearQueryParams}
							saveAction={handleCategorySubmit(onCategorySubmit)}
						/>
					</Modal.Footer>
				</Modal.Content>
			</Modal>
		</>
	);
};

export { CategoryModal };
