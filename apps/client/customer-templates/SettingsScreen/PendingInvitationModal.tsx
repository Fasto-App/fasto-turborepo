import { Heading, HStack, Box, Button, Text, FlatList } from "native-base";
import React, { useCallback } from "react";
import { CustomModal } from "../../components/CustomModal/CustomModal";
import { getClientCookies } from "../../cookies";
import {
	useAcceptInvitationMutation,
	useGetPendingInvitationsQuery,
	useDeclineInvitationMutation,
	GetPendingInvitationsDocument,
	GetClientSessionDocument,
} from "../../gen/generated";
import { useRouter } from "next/router";
import { showToast } from "../../components/showToast";
import { getCause } from "../../apollo-client/ErrorLink";
import { useTranslation } from "next-i18next";

type PendingInvitationModalProps = {
	isModalOpen: boolean;
	setIsModalOpen: (value: boolean) => void;
};

const refetchOptions = [
	{ query: GetPendingInvitationsDocument },
	{ query: GetClientSessionDocument },
];

export const PendingInvitationModal = (props: PendingInvitationModalProps) => {
	const { isModalOpen, setIsModalOpen } = props;

	const { query } = useRouter();
	const { businessId } = query;

	const { t } = useTranslation("customerSettings");

	const token = getClientCookies(businessId as string);

	const { data, loading } = useGetPendingInvitationsQuery({
		skip: !token || !isModalOpen,
		pollInterval: 1000 * 60,
		fetchPolicy: "network-only",
	});

	const [acceptInvitation, { loading: acceptLoading }] =
		useAcceptInvitationMutation({
			refetchQueries: refetchOptions,
			onCompleted: () => {
				showToast({
					message: t("invitationAccepted"),
				});
			},
			onError: (error) => {
				showToast({
					message: t("errorAcceptingInvitation"),
					subMessage: getCause(error),
					status: "error",
				});
			},
		});
	const [declineInvitation, { loading: declineLoading }] =
		useDeclineInvitationMutation({
			refetchQueries: refetchOptions,
			onCompleted: () => {
				showToast({
					message: t("invitationDeclined"),
				});
			},
			onError: (error) => {
				showToast({
					message: t("errorDecliningInvitation"),
					subMessage: getCause(error),
					status: "error",
				});
			},
		});

	const onDecline = useCallback(
		(id: string) => {
			declineInvitation({
				variables: {
					input: {
						_id: id,
					},
				},
			});
		},
		[declineInvitation],
	);

	const onAccept = useCallback(
		(id: string) => {
			acceptInvitation({
				variables: {
					input: {
						_id: id,
					},
				},
			});
		},
		[acceptInvitation],
	);

	return (
		<CustomModal
			size={"full"}
			onClose={() => setIsModalOpen(false)}
			isOpen={isModalOpen}
			HeaderComponent={
				<Heading textAlign={"center"} fontSize={"2xl"}>
					{t("pendingInvitations")}
				</Heading>
			}
			ModalBody={
				loading ? (
					<Text>Loading</Text>
				) : (
					<FlatList
						data={data?.getPendingInvitations}
						keyExtractor={(item, index) => index.toString()}
						renderItem={({ item, index }) => (
							<PendingInvitationTile
								index={index}
								name={item?.requestor?.name}
								phone={item?.requestor?.phoneNumber}
								loading={acceptLoading || declineLoading}
								onDecline={() => onDecline(item._id)}
								onAccept={() => onAccept(item._id)}
							/>
						)}
						ListEmptyComponent={
							<Text textAlign={"center"}>{t("noPendingInvitations")}</Text>
						}
					/>
				)
			}
			ModalFooter={
				<Button
					colorScheme={"gray"}
					w={"100%"}
					onPress={() => setIsModalOpen(false)}
				>
					{t("close")}
				</Button>
			}
		/>
	);
};

const PendingInvitationTile = ({
	index,
	onDecline,
	onAccept,
	name,
	phone,
	loading,
}: {
	index: number;
	name?: string | null;
	phone?: string | null;
	onDecline: () => void;
	onAccept: () => void;
	loading?: boolean;
}) => {
	const { t } = useTranslation("customerSettings");

	return (
		<HStack
			space={4}
			p={2}
			backgroundColor={index % 2 === 0 ? "secondary.200" : "white"}
			borderRadius={"md"}
			alignItems={"center"}
		>
			<Box flex={1}>
				<Text fontSize={"lg"}>{name}</Text>
				<Text fontSize={"md"}>{phone}</Text>
			</Box>
			<Button.Group
				h={"10"}
				flex={1}
				justifyContent={"space-between"}
				space={4}
			>
				<Button
					flex={1}
					colorScheme={"tertiary"}
					onPress={onAccept}
					isLoading={loading}
				>
					{t("accept")}
				</Button>
				<Button flex={1} onPress={onDecline} isLoading={loading}>
					{t("decline")}
				</Button>
			</Button.Group>
		</HStack>
	);
};
