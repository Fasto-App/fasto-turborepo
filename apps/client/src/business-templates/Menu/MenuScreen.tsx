import React from "react";
import { VStack } from "native-base";
import { MenuList } from "./MenuList";
import MenuProducts from "./MenuProducts";
import { Box } from "native-base";
import { useGetAllMenusByBusinessIdQuery } from "../../gen/generated";
import { useAppStore } from "../UseAppStore";
import { Loading } from "../../components/Loading";
import { showToast } from "../../components/showToast";

const MenuScreen = () => {
	const { data, loading: loadingQuery } = useGetAllMenusByBusinessIdQuery({
		onError: () => {
			showToast({
				message: "Error",
				status: "error",
			});
		},
	});

	return (
		<Box flex={1}>
			<Box
				backgroundColor={"primary.500"}
				h={100}
				w={"100%"}
				position={"absolute"}
				zIndex={-1}
			/>
			<VStack flex={1} m={"4"} space={"4"}>
				<MenuList menusData={data?.getAllMenusByBusinessID ?? []} />
				{data?.getAllMenusByBusinessID ? <MenuProducts /> : null}
			</VStack>
			<Loading isLoading={loadingQuery} />
		</Box>
	);
};

export { MenuScreen };
