import React, { useCallback } from "react";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Modal } from "native-base";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ControlledForm } from "../../components/ControlledForm/ControlledForm";
import { useSpacesMutationHook } from "../../graphQL/SpaceQL";
import { useTranslation } from "next-i18next";

const spaceSchema = z.object({
	space_name: z.string().min(2, "error.spaceError"),
});

type spaceSchemaInput = z.infer<typeof spaceSchema>;

type SpaceModalProps = {
	isModalOpen: boolean;
	setIsModalOpen: (value: boolean) => void;
};

export const SpaceModal = ({
	isModalOpen,
	setIsModalOpen,
}: SpaceModalProps) => {
	const { control, formState, clearErrors, reset, handleSubmit } = useForm({
		defaultValues: {
			space_name: "",
		},
		resolver: zodResolver(spaceSchema),
	});

	const { createSpace } = useSpacesMutationHook();

	const { t } = useTranslation(["common", "businessTables"]);

	const onSubmit = useCallback(
		async (data: spaceSchemaInput) => {
			setIsModalOpen(false);

			await createSpace({
				variables: {
					input: { name: data.space_name },
				},
			});
			reset();
		},
		[createSpace, reset, setIsModalOpen],
	);

	const onCancel = useCallback(() => {
		setIsModalOpen(false);
		reset();
		clearErrors();
	}, [clearErrors, reset, setIsModalOpen]);

	return (
		<Modal isOpen={isModalOpen} onClose={onCancel}>
			<Modal.CloseButton />
			<DevTool control={control} /> {/* set up the dev tool */}
			<Modal.Content minWidth="500px">
				<Modal.Header>{t("businessTables:addSpace")}</Modal.Header>
				<Modal.Body>
					<ControlledForm
						control={control}
						formState={formState}
						Config={{
							space_name: {
								name: "space_name",
								label: t("businessTables:spaceName"),
								placeholder: t("businessTables:spaceExample"),
								isRequired: true,
							},
						}}
					/>
				</Modal.Body>
				<Modal.Footer borderColor={"white"}>
					<Button.Group space={2} flex={1}>
						<Button
							w={"100px"}
							variant="outline"
							colorScheme="tertiary"
							onPress={onCancel}
							flex={1}
						>
							{t("cancel")}
						</Button>
						<Button w={"100px"} onPress={handleSubmit(onSubmit)} flex={1}>
							{t("save")}
						</Button>
					</Button.Group>
				</Modal.Footer>
			</Modal.Content>
		</Modal>
	);
};
