import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { Box, Button, Heading } from "native-base";
import { CustomModal } from "../../components/CustomModal/CustomModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	ControlledForm,
	SideBySideInputConfig,
} from "../../components/ControlledForm";
import { useRequestJoinTabMutation } from "../../gen/generated";
import { setClientCookies } from "../../cookies";
import { customerRoute } from "fasto-route";
import { showToast } from "../../components/showToast";
import { getCause } from "../../apollo-client/ErrorLink";
import { useTranslation } from "next-i18next";
import {
	getCustomerName,
	getCustomerPhone,
	setCustomerName,
	setCustomerPhone,
} from "../../localStorage/customerStorage";
import { z } from "zod";

export const joinTabSchema = z.object({
	name: z.string().min(3, { message: "error.nameRequired" }),
	phoneNumber: z.string().min(6, { message: "error.required" }),
});
export type JoinTabForm = z.infer<typeof joinTabSchema>;

type JoinTabModalProps = {
	isOpen: boolean;
	setModalVisibility: (isOpen: boolean) => void;
};

const Config: SideBySideInputConfig = {
	name: {
		name: "name",
		label: "Name",
		type: "text",
		placeholder: "Enter name",
		isRequired: true,
		autoFocus: true,
	},
	phoneNumber: {
		label: "Phone Number",
		placeholder: "+55 555 555 5555",
		name: "phoneNumber",
		isRequired: true,
		autoFocus: true,
		autoComplete: "tel-country-code",
	},
};

export const JoinTabModal = ({
	isOpen,
	setModalVisibility,
}: JoinTabModalProps) => {
	const router = useRouter();
	const { tabId, name, adminId, businessId } = router.query;
	const { t } = useTranslation("customerHome");

	const { control, formState, handleSubmit } = useForm({
		resolver: zodResolver(joinTabSchema),
		defaultValues: {
			name: getCustomerName() || "",
			phoneNumber: getCustomerPhone() || "",
		},
	});

	const [requestJoinTab, { loading }] = useRequestJoinTabMutation({
		onError: (error) => {
			console.log("error", error);
			showToast({
				message: "Error joining tab",
				subMessage: getCause(error),
				status: "error",
			});
		},
		onCompleted: (data) => {
			// get the token back and store in the cookies
			console.log("Tab Request Completed");
			if (!data?.requestJoinTab || typeof businessId !== "string") {
				throw new Error("Tab Request Error");
			}

			setClientCookies(businessId, data?.requestJoinTab);

			router.push({
				pathname: customerRoute["/customer/[businessId]/menu"],
				query: {
					businessId,
				},
			});
		},
	});

	const handleJoinTab = useCallback(
		async (data: JoinTabForm) => {
			console.log("clicked");
			console.log(data);

			if (!tabId || !adminId) {
				alert("Error: COuld not read QR Code properly");
				return;
			}

			await requestJoinTab({
				variables: {
					input: {
						tab: typeof tabId === "string" ? tabId : tabId[0],
						admin: typeof adminId === "string" ? adminId : adminId[0],
						name: data.name,
						phoneNumber: data.phoneNumber,
						business: router.query.businessId as string,
					},
				},
			});

			setCustomerName(data.name);
			setCustomerPhone(data.phoneNumber);

			setModalVisibility(false);
		},
		[
			adminId,
			requestJoinTab,
			router.query.businessId,
			setModalVisibility,
			tabId,
		],
	);

	if (!tabId || !name) null;

	return (
		<CustomModal
			onClose={() => setModalVisibility(false)}
			isOpen={isOpen}
			HeaderComponent={
				<Heading>
					{t("yourAboutToJoin", {
						name: typeof name === "string" ? name : name?.[0],
					})}
				</Heading>
			}
			ModalBody={
				<ControlledForm
					Config={Config}
					control={control}
					formState={formState}
				/>
			}
			ModalFooter={
				<Button.Group flex={1}>
					<Box flex={1}>
						{tabId && name ? (
							<Button
								onPress={handleSubmit(handleJoinTab)}
								_text={{ bold: true }}
								w={"100%"}
							>
								{t("join")}
							</Button>
						) : null}
					</Box>
					<Box flex={1}>
						<Button
							isLoading={loading}
							onPress={() => setModalVisibility(false)}
							_text={{ bold: true }}
							colorScheme={"trueGray"}
							w={"100%"}
						>
							{t("cancel")}
						</Button>
					</Box>
				</Button.Group>
			}
		/>
	);
};
