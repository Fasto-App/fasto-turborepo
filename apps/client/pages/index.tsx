import React from "react"
import Link from 'next/link';
import { Pressable } from 'react-native'
import { HStack, Text, Center, VStack, useBreakpointValue, } from "native-base"
import { useGetAllBusinessQuery } from "../gen/generated";
import { clientRoute } from "../routes";

export default function Home() {


	// get all the business hereuseGetAllBusinessQuery
	const { data } = useGetAllBusinessQuery()

	return (
		<VStack space={6} justifyContent="center" alignItems={"center"} p={16} w={"100%"}>
			{data?.getAllBusiness.map((business) => {
				if (!business?._id) return null

				return (
					<Pressable key={business?._id}>
						<Link href={clientRoute.home(business?._id)}>
							<Center width={{
								base: 300,
								sm: 400
							}} h="20" bg="secondary.500" rounded="md" shadow={3}>
								<Text color={"white"} fontSize="lg">{business?.name}</Text>
							</Center>
						</Link>
					</Pressable>
				)
			})}

			<Pressable>
				<Link href={'/business/login'}>
					<Center width={{
						base: 300,
						sm: 400
					}} h="20" bg="secondary.800" rounded="md" shadow={3}>
						<Text color={"white"} fontSize="lg">Business Dashboard</Text>
					</Center>
				</Link>
			</Pressable>
		</VStack>

	);
}