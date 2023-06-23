import { BusinessesScreen } from "../customer-templates/BusinessesScreen";
import React from "react"

// export default BusinessesScreen

export default function Index() {

  return <iframe src="html/index.html" width={"100%"} height={"100%"}></iframe>
}

// import React, { useEffect } from "react"
// import Link from 'next/link';
// import { Image, HStack, Text, Center, VStack, useBreakpointValue, Skeleton, Box, Pressable, AspectRatio, ScrollView, FlatList } from "native-base"
// import { useGetAllBusinessQuery } from "../gen/generated";
// import { businessRoute, customerRoute } from "../routes";
// import { NavigationButton } from "../components/atoms/NavigationButton";
// import { useRouter } from "next/router";
// import Head from "next/head";
// import { logEvent } from "firebase/analytics";
// import { analytics } from "../firebase/init";
// import { Helmet } from "react-helmet";

// const width = {
// 	base: 220,
// 	sm: 270
// }

// const LoadingTiles = () => {
// 	return (
// 		<VStack space={6} justifyContent="center" alignItems={"center"} p={16} w={"100%"}>
// 			{[1, 2, 3].map((i) => {
// 				return (
// 					<Box key={i} width={width} h="20" bg="secondary.500" rounded="md" shadow={3}>
// 						<Skeleton w="100%" h="100%" rounded="md" />
// 					</Box>
// 				)
// 			})}
// 		</VStack>
// 	)
// }


// export default function Home() {
// 	const { data, loading, error } = useGetAllBusinessQuery()

// 	const columnNum = useBreakpointValue({
// 		base: 1,
// 		lg: 2
// 	});

// 	useEffect(() => {
// 		analytics && logEvent(analytics, "page_view", {
// 			page_title: "Landing Page",
// 			page_path: "/"
// 		})
// 	}, [])

// 	const router = useRouter()

// 	return (
// 		<>

// 			<Box backgroundColor={"pink"} h={"full"}>
// 				<HStack position={"revert"} justifyContent={"space-between"} p={8}>
// 					<Image src="/images/fasto-logo.svg" alt="Fasto Logo" height={36} width={180} />
// 					<Center>
// 						<div style={{
// 							background: "linear-gradient(349deg, rgba(227,232,0,1) 0%, rgba(255,102,0,1) 25%)",
// 							borderRadius: "100%"
// 						}}>
// 							<NavigationButton
// 								type={"UserAdd"}
// 								color="black"
// 								onPress={function (): void {
// 									router.push(businessRoute.login);
// 								}} />
// 						</div>
// 					</Center>
// 				</HStack>
// 				<FlatList
// 					key={columnNum}
// 					numColumns={columnNum}
// 					data={data?.getAllBusiness}
// 					renderItem={({ item: business }) => {
// 						if (!business?._id) return null

// 						return (
// 							<BusinessCard />
// 						)
// 					}}
// 				/>



// 				<ScrollView p={16} w={"100%"} flexWrap={"wrap"} >
// 					{error ? <Text>{error.message}</Text> : null}
// 					{loading ? <LoadingTiles /> : null}

// 					{data?.getAllBusiness.map((business) => {
// 						if (!business?._id) return null

// 						return (
// 							<Pressable key={business?._id} p="4">
// 								<Link href={`${customerRoute["/customer/[businessId]"].replace(`[businessId]`, business?._id)}`}>
// 									<Center width={width} h="20" bg="secondary.500" rounded="md" shadow={3}>
// 										<Text color={"white"} fontSize="lg">{business?.name}</Text>
// 									</Center>
// 								</Link>
// 							</Pressable>
// 						)
// 					})}
// 				</ScrollView>
// 			</Box >
// 			<Helmet>
// 				<title>Fasto</title>
// 				<script type="application/javascript" async>
// 					{`
// 						console.log("Hello World")
// 					`}
// 				</script>
// 			</Helmet>
// 		</>
// 	);
// }

// const BusinessCard = ({ business = { name: "Ronaldo Fenomeno Di Fiore" } }: { business: { name: string } }) => {

// 	return (
// 		<HStack flex={1} borderWidth={1}>
// 			<Box borderWidth={1}>
// 				<AspectRatio

// 					height={128}
// 					ratio={16 / 9}>
// 					<Image src="/images/fasto-logo.svg" alt="Fasto Logo" resizeMode="stretch" />
// 				</AspectRatio>
// 			</Box>
// 			<VStack>
// 				<Text fontSize={"lg"}>{business?.name}</Text>
// 				<Text fontSize={"lg"} color={"secondary.500"}>{"Lorem Ipsum is simply dummy text of the printing and typesetting"}</Text>
// 				<Text fontSize={"lg"} color={"secondary.500"}>{"Lorem Ipsum is simply dummy text of the printing and typesetting"}</Text>
// 			</VStack>
// 		</HStack>
// 	)
// }