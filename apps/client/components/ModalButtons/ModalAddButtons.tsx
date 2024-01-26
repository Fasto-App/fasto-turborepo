import { Button } from "native-base";
import React from "react";
import { useTranslation } from "next-i18next";

type ModalAddButtonsProps = {
	cancelAction: () => void;
	saveAction: () => void;
	isEditing: boolean;
};

const ModalAddButtons = ({
	cancelAction,
	saveAction,
	isEditing,
}: ModalAddButtonsProps) => {
	const { t } = useTranslation("common");
	return (
		<Button.Group space={2} flex={1}>
			<Button
				w={"100px"}
				variant="outline"
				colorScheme="tertiary"
				onPress={cancelAction}
				flex={1}
			>
				{t("cancel")}
			</Button>
			<Button w={"100px"} onPress={saveAction} flex={1}>
				{isEditing ? t("save") : t("add")}
			</Button>
		</Button.Group>
	);
};

export { ModalAddButtons };
