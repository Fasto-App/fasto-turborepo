import React from "react";
import { CustomModal } from "../../components/CustomModal/CustomModal";
import { Badge, Box, Button, FlatList, HStack, Text } from "native-base";
import {
	DateType,
	GetOrdersGroupDocument,
	OrderStatus,
	useGetOrderGroupByIdQuery,
	useUpdateOrderGroupDataMutation,
} from "../../gen/generated";
import { LoadingCartItems } from "../../customer-templates/CartScreen/LoadingTiles";
import {
	PastOrdersTile,
	PastOrdersTileWithoutImage,
} from "../../customer-templates/CartScreen/PastOrdersModal";
import {
	PRODUCT_PLACEHOLDER_IMAGE,
	parseToCurrency,
	typedValues,
} from "app-helpers";
import { useTranslation } from "next-i18next";
import { FDSSelect } from "../../components/FDSSelect";
import { formatDateFNS, getOrderColor } from "./utils";
import { showToast } from "../../components/showToast";

type OrdersModalProps = {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	orderId: string;
	input?: any;
};

export const OrdersModal = ({
	isOpen,
	setIsOpen,
	orderId,
	input,
}: OrdersModalProps) => {
	const { t } = useTranslation("businessOrders");

	const orderStatus = typedValues(OrderStatus).map((status) => ({
		_id: status,
		value: t(status),
	}));

	const { data, loading, error } = useGetOrderGroupByIdQuery({
		skip: !orderId,
		variables: {
			getOrderGroupByIdId: orderId,
		},
	});

	const [updateGroupOrder, { loading: updatLoading }] =
		useUpdateOrderGroupDataMutation({
			refetchQueries: [
				{
					query: GetOrdersGroupDocument,
					variables: {
						input,
					},
				},
			],
			onCompleted(data, clientOptions) {
				setIsOpen(false);
			},
			onError(error, clientOptions) {
				showToast({
					message: t("errorUpdatingOrder"),
					status: "error",
				});
			},
		});

	const orderDate = formatDateFNS(data?.getOrderGroupById.created_date);

	const onPrint = () => {
		let tempTitle;

		tempTitle = document.title;
		document.title = orderDate;

		print();
		document.title = orderDate;
	};

	const updateOnChange = (value: OrderStatus) => {
		updateGroupOrder({
			variables: {
				input: {
					_id: orderId,
					status: value,
				},
			},
		});
	};

	return (
		<>
			<CustomModal
				size={"xl"}
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				HeaderComponent={
					<HStack justifyContent={"space-between"} space={"2"} pb={"4"}>
						<HStack space={6}>
							<Text fontSize={"lg"}>{t("orderDetails")}</Text>
							<Badge
								variant={"subtle"}
								colorScheme={getOrderColor(data?.getOrderGroupById.status)}
							>
								{data && t(data?.getOrderGroupById.status)}
							</Badge>
						</HStack>
						<HStack space={"2"}>
							<FDSSelect
								w={"120px"}
								h={"8"}
								placeholder={"Type"}
								selectedValue={data?.getOrderGroupById.status}
								setSelectedValue={updateOnChange}
								array={orderStatus}
							/>
						</HStack>
					</HStack>
				}
				ModalBody={
					<>
						{loading || updatLoading ? (
							<LoadingCartItems />
						) : error ? (
							<Text>{t("sorryCouldNotLoadOrders")}</Text>
						) : (
							<>
								<Text fontSize={"lg"} paddingBottom={"4"}>
									{orderDate}
								</Text>
								<FlatList
									data={data?.getOrderGroupById.orders}
									renderItem={({ item, index }) =>
										!!item ? (
											<PastOrdersTile
												index={index}
												name={item.product.name}
												url={item.product.imageUrl || PRODUCT_PLACEHOLDER_IMAGE}
												price={parseToCurrency(item.subTotal)}
												quantity={item.quantity}
												orderStatus={item.status}
												_id={item._id}
											/>
										) : null
									}
								/>
							</>
						)}
					</>
				}
				ModalFooter={
					<Button.Group space={2} flex={1}>
						<Button
							onPress={() => setIsOpen(false)}
							flex={1}
							colorScheme={"tertiary"}
						>
							{t("close")}
						</Button>
						<Button flex={1} onPress={onPrint}>
							{t("print")}
						</Button>
					</Button.Group>
				}
			/>
			<Box nativeID={"section-to-print"} padding={6}>
				<Text fontSize={"lg"} paddingY={"6"}>
					{orderDate}
				</Text>
				<FlatList
					data={data?.getOrderGroupById.orders}
					renderItem={({ item, index }) =>
						!!item ? (
							<PastOrdersTileWithoutImage
								index={index}
								name={item.product.name}
								price={parseToCurrency(item.subTotal)}
								quantity={item.quantity}
								orderStatus={t([item.status]) as OrderStatus}
								_id={item._id}
							/>
						) : null
					}
				/>
			</Box>
		</>
	);
};
