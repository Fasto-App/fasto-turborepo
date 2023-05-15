import React from "react";
import { Modal } from "native-base";
import { Control, FormState, UseFormHandleSubmit } from "react-hook-form";
import { DeleteAlert } from "../../components/DeleteAlert";
import { useCategoryMutationHook } from "../../graphQL/CategoryQL";
import { useAppStore } from "../UseAppStore";
import { ControlledForm } from "../../components/ControlledForm/ControlledForm";
import { CategoryFields } from "./useCategoryFormHook";
import { ModalAddButtons } from "../../components/ModalButtons";
import { useTranslation } from "next-i18next";

type CategoriesModalProps = {
  showModal: boolean;
  setShowModal: (val: boolean) => void;
  categoryControl: Control<CategoryFields>;
  categoryFormState: FormState<CategoryFields>;
  handleCategorySubmit: UseFormHandleSubmit<CategoryFields>;
  resetCategoryForm: () => void;
};

const CategoryModal = ({
  showModal,
  setShowModal,
  categoryControl,
  categoryFormState,
  handleCategorySubmit,
  resetCategoryForm,
}: CategoriesModalProps) => {
  const setCategory = useAppStore((state) => state.setCategory);
  const categoryId = useAppStore((state) => state.category);
  const nameError = useAppStore((state) =>
    state.networkState === "error" ? state.networkState : ""
  );
  const isEditing = !!categoryId;

  const { t } = useTranslation("businessCategoriesProducts");

  const { updateCategory, createCategory, deleteCategory, categoryError } =
    useCategoryMutationHook();

  const closeModalAndClearQueryParams = () => {
    setCategory(null);
    setShowModal(false);
    resetCategoryForm();
  };

  const onCategorySubmit = async (values: CategoryFields) => {
    console.log("onCategorySubmit", values);
    // if theres a categoryId, then we are updating a category
    if (values._id) {
      updateCategory({
        variables: {
          input: {
            _id: values._id,
            name: values.categoryName,
          },
        },
      });
    } else {
      createCategory({
        variables: {
          input: {
            name: values.categoryName,
          },
        },
      });
    }

    closeModalAndClearQueryParams();
  };

  const deleteCategoryCb = () => {
    if (!categoryId) return;

    closeModalAndClearQueryParams();
    deleteCategory({
      variables: {
        id: categoryId,
      },
    });
  };

  return (
    <>
      <Modal isOpen={showModal} onClose={closeModalAndClearQueryParams}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>
            {isEditing ? t("editTitle") : t("addTitle")}
          </Modal.Header>
          <Modal.Body>
            {/* Name */}
            <ControlledForm
              control={categoryControl}
              formState={categoryFormState}
              Config={{
                categoryName: {
                  name: "categoryName",
                  label: t("dishesCategories"),
                  placeholder: t("dishesCategories"),
                  helperText: t("categoriesHelperText"),
                },
              }}
            />
            {isEditing ? (
              <DeleteAlert
                deleteItem={() => {
                  deleteCategoryCb();
                  setShowModal(false);
                }}
                title={t("delete")}
              />
            ) : null}
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
