import React, { useCallback } from "react";
import { useRouter } from "next/router";
import { customerRoute, customerRouteKeys } from "fasto-route";
import { HStack, useBreakpointValue } from "native-base";
import { NavigationButton } from "../../components/atoms/NavigationButton";
import { useGetClientSession } from "../../hooks";

const ClientTabBar: React.FC = () => {
	const router = useRouter();
	const { businessId } = router.query;

	const useIsPageSelected = useCallback(
		(pathname: customerRouteKeys, slug?: string) => {
			if (typeof businessId !== "string") return false;

			return router.pathname === pathname;
		},
		[businessId, router.pathname],
	);

	const isMenu = useIsPageSelected("/customer/[businessId]/menu");
	const isCart = useIsPageSelected("/customer/[businessId]/cart");
	const isSettings = useIsPageSelected("/customer/[businessId]/settings");

	const { data: clientData } = useGetClientSession();

	const paddingX = useBreakpointValue({
		base: "8",
		lg: "16",
	});

	if (!businessId || typeof businessId !== "string") return null;

	return (
		<HStack
			w={"100%"}
			justifyContent={"space-between"}
			paddingY={"2"}
			paddingX={paddingX}
			bg={"primary.500"}
		>
			<NavigationButton
				type={"ListStar"}
				selected={isMenu}
				onPress={() => {
					router.push({
						pathname: customerRoute["/customer/[businessId]/menu"],
						query: {
							businessId,
						},
					});
				}}
			/>
			<NavigationButton
				type={"Bag"}
				selected={isCart}
				numNotifications={clientData?.getClientSession.tab?.cartItems?.length}
				onPress={() => {
					router.push({
						pathname: customerRoute["/customer/[businessId]/cart"],
						query: {
							businessId,
						},
					});
				}}
			/>
			<NavigationButton
				type={"Settings"}
				selected={isSettings}
				onPress={() => {
					router.push({
						pathname: customerRoute["/customer/[businessId]/settings"],
						query: {
							businessId,
						},
					});
				}}
			/>
		</HStack>
	);
};

ClientTabBar.displayName = "ClientTabBar";

export { ClientTabBar };
//miscelanious
