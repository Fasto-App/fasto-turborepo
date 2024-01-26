import React, { useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge, Button, Text } from "native-base";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import {
	ControlledForm,
	RegularInputConfig,
} from "../../components/ControlledForm/ControlledForm";
import {
	GetSpacesFromBusinessDocument,
	useCreateTabMutation,
	useGetTabByIdQuery,
	useGetTableByIdQuery,
	useRequestCloseTabMutation,
} from "../../gen/generated";
import { businessRoute } from "fasto-route";
import { badgeScheme } from "./config";
import { OccupiedModal } from "./OccupiedModal";
import * as z from "zod";
import { CustomModal } from "../../components/CustomModal/CustomModal";
import { useTranslation } from "next-i18next";
import { showToast } from "../../components/showToast";

const newTabSchema = z.object({
	admin: z.string().optional(),
	totalUsers: z.number({
		required_error: "error.tabError",
		invalid_type_error: "error.tabError",
	}),
});

type newTabSchema = z.infer<typeof newTabSchema>;

export const NewTabModal = ({
	tableId,
	setIsModalOpen,
}: {
	tableId?: string;
	setIsModalOpen: () => void;
}) => {
	const router = useRouter();

	const { t } = useTranslation("businessTables");

	const { data: tableData, loading } = useGetTableByIdQuery({
		skip: !tableId,
		variables: {
			input: {
				_id: tableId as string,
			},
		},
	});

	const SideBySideTabConfig: RegularInputConfig = {
		totalUsers: {
			name: "totalUsers",
			isRequired: true,
			label: t("numberOfGuests"),
			placeholder: t("selectedNumberOfGuests"),
			inputType: "Number",
		},
	};

	const { control, formState, handleSubmit } = useForm({
		defaultValues: {
			admin: "",
			totalUsers: "",
		},
		resolver: zodResolver(newTabSchema),
	});

	const [createTab] = useCreateTabMutation({
		refetchQueries: [{ query: GetSpacesFromBusinessDocument }],
		onCompleted: (data) => {
			router.push({
				pathname: businessRoute["add-to-order"],
				query: { tabId: data.createTab._id },
			});
		},
		onError: () => {
			showToast({
				status: "error",
				message: t("errorCreatingTab"),
			});
		},
	});

	const onSubmit = useCallback(
		async (data: newTabSchema) => {
			if (!tableData?.getTableById._id) throw "Table id is undefined";

			createTab({
				variables: {
					input: {
						table: tableData?.getTableById?._id,
						admin: data.admin,
						totalUsers: data.totalUsers,
					},
				},
			});
		},
		[createTab, tableData?.getTableById._id],
	);

	if (!tableId) return null;

	return (
		<CustomModal
			size={"lg"}
			isOpen={!!tableId}
			HeaderComponent={
				<>
					<Badge mt={2} width={"20"} colorScheme={"success"}>
						{t("Available")}
					</Badge>
				</>
			}
			ModalBody={
				<ControlledForm
					control={control}
					formState={formState}
					Config={SideBySideTabConfig}
				/>
			}
			ModalFooter={
				<Button.Group flex={1} justifyContent={"center"} space={4}>
					<Button
						flex={1}
						w={"200px"}
						variant="outline"
						colorScheme="tertiary"
						onPress={setIsModalOpen}
					>
						{t("cancel")}
					</Button>
					<Button
						flex={1}
						w={"200px"}
						// @ts-ignore
						onPress={handleSubmit(onSubmit)}
						isLoading={loading}
					>
						{t("openTab")}
					</Button>
				</Button.Group>
			}
		/>
	);
};

export const OccupiedTabModal = ({
	tabId,
	setIsModalOpen,
}: {
	tabId?: string;
	setIsModalOpen: () => void;
}) => {
	const { t } = useTranslation("businessTables");

	const router = useRouter();
	const { data, loading } = useGetTabByIdQuery({
		variables: {
			input: {
				_id: tabId as string,
			},
		},
		skip: !tabId,
		onError: (error) => {
			showToast({
				status: "error",
				message: t("errorGettingTabData"),
			});
		},
	});

	const onSubmit = useCallback(
		async (d: any) => {
			if (!data?.getTabByID?._id) throw new Error("Tab id is undefined");

			if (data?.getTabByID?.status === "Pendent" && data?.getTabByID.checkout) {
				router.push({
					pathname: businessRoute["checkout/[checkoutId]"],
					query: {
						checkoutId: data.getTabByID.checkout,
						tabId: data.getTabByID._id,
					},
				});

				return;
			}

			router.push({
				pathname: businessRoute["add-to-order"],
				query: { tabId: data.getTabByID._id },
			});
		},
		[
			data?.getTabByID._id,
			data?.getTabByID.checkout,
			data?.getTabByID?.status,
			router,
		],
	);

	const [requestCloseTabMutation, { loading: loadingCloseTab }] =
		useRequestCloseTabMutation({
			refetchQueries: ["GetSpacesFromBusiness"],
			onCompleted: (data) => {
				showToast({
					message: t("requestToCloseTabSuccessfully"),
				});

				switch (data?.requestCloseTab?.status) {
					case "Pendent":
						if (!data?.requestCloseTab?.checkout)
							throw new Error("Checkout id is missing");

						router.push({
							pathname: businessRoute["checkout/[checkoutId]"],
							query: {
								checkoutId: data?.requestCloseTab?.checkout,
								tabId,
							},
						});

						setIsModalOpen();
						break;
					default:
						router.back();
						break;
				}
			},
		});

	const requestCloseTab = useCallback(() => {
		requestCloseTabMutation({
			variables: {
				input: {
					_id: tabId as string,
				},
			},
		});
	}, [requestCloseTabMutation, tabId]);

	if (!tabId) return null;

	return (
		<CustomModal
			size={"full"}
			isOpen={!!tabId}
			HeaderComponent={
				<>
					<Text fontSize={"20"}>{`${t("table")} ${1}`}</Text>

					<Badge
						mt={2}
						width={"20"}
						colorScheme={badgeScheme(data?.getTabByID?.status)}
					>
						{!!data?.getTabByID?.status && t(data?.getTabByID?.status)}
					</Badge>
					{tabId ? (
						<Button
							alignSelf="end"
							mt={-12}
							colorScheme={"primary"}
							width={"100px"}
							onPress={requestCloseTab}
							isLoading={loadingCloseTab}
						>
							{t("closeTab")}
						</Button>
					) : null}
				</>
			}
			ModalBody={
				<OccupiedModal
					orders={data?.getTabByID?.orders}
					users={data?.getTabByID?.users}
				/>
			}
			ModalFooter={
				<Button.Group flex={1} justifyContent={"center"} space={4}>
					<Button
						flex={1}
						w={"200px"}
						variant="outline"
						colorScheme="tertiary"
						onPress={setIsModalOpen}
					>
						{t("cancel")}
					</Button>
					<Button flex={1} w={"200px"} onPress={onSubmit} isLoading={loading}>
						{data?.getTabByID?.status === "Pendent"
							? t("checkout")
							: t("addNewItem")}
					</Button>
				</Button.Group>
			}
		/>
	);
};
