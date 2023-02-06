import React from "react"
import Link from 'next/link';
import { Pressable } from 'react-native'
import { HStack, Text, Center, VStack, useBreakpointValue, } from "native-base"

export default function Home() {

	const HomeStack = useBreakpointValue({
		base: VStack,
		lg: HStack
	});

	return (
		<HomeStack space={6} justifyContent="center" alignItems={"center"} p={16} w={"100%"}>
			<Pressable>
				<Link href={'/client/menu'}>
					<Center width={{
						base: 300,
						sm: 400
					}} h="20" bg="secondary.500" rounded="md" shadow={3}>
						<Text color={"white"} fontSize="lg">Client App</Text>
					</Center>
				</Link>
			</Pressable>

			<Pressable>
				<Link href={'/business/login'}>
					<Center width={{
						base: 300,
						sm: 400
					}} h="20" bg="secondary.800" rounded="md" shadow={3}>
						<Text color={"white"} fontSize="lg">Business Dashboard changes from development</Text>
					</Center>
				</Link>
			</Pressable>
		</HomeStack>

	);
}