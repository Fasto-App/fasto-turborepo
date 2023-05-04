import React from "react"
import Link from 'next/link';
import { Pressable } from 'react-native'
import { HStack, Text, Center, VStack, useBreakpointValue, Skeleton, Box, } from "native-base"
import { useGetAllBusinessQuery } from "../gen/generated";
import { customerRoute } from "../routes";

const width = {
	base: 300,
	sm: 400
}

const LoadingTiles = () => {
	return (
		<VStack space={6} justifyContent="center" alignItems={"center"} p={16} w={"100%"}>
			{[1, 2, 3].map((i) => {
				return (
					<Box key={i} width={width} h="20" bg="secondary.500" rounded="md" shadow={3}>
						<Skeleton w="100%" h="100%" rounded="md" />
					</Box>
				)
			})}
		</VStack>
	)
}


export default function Home() {
	const { data, loading, error } = useGetAllBusinessQuery()

	return (
		<VStack space={6} justifyContent="center" alignItems={"center"} p={16} w={"100%"}>
			{error ? <Text>{error.message}</Text> : null}
			{loading ? <LoadingTiles /> : null}
			{data?.getAllBusiness.map((business) => {
				if (!business?._id) return null

				return (
					<Pressable key={business?._id}>
						<Link href={customerRoute.home(business?._id)}>
							<Center width={width} h="20" bg="secondary.500" rounded="md" shadow={3}>
								<Text color={"white"} fontSize="lg">{business?.name}</Text>
							</Center>
						</Link>
					</Pressable>
				)
			})}
			<Pressable>
				<Link href={'/business/login'}>
					<Center width={width} h="20" bg="tertiary.500" rounded="md" shadow={3}>
						<Text color={"white"} fontSize="lg">Business Dashboard</Text>
					</Center>
				</Link>
			</Pressable>
		</VStack>

	);
}