import React from 'react';
import NextLink from 'next/link';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { LoginFormFields } from '../types';
import { Center, Box, Heading, VStack, HStack, FormControl, Link, Text, Button, Input, } from "native-base"
import { Pressable } from 'react-native';
import { NextRouter } from 'next/router';
import { validateEmail, validatePassword } from '../../authUtilities/utils';
import { ApolloError } from '@apollo/client';
import { HideAndShowIcon } from '../../components/atoms/HideAndShowIcon';

const text = {
	welcome: 'OpenTab is a reliable and interactive platform to help inovate the business industry',
};

export interface LoginScreenProps {
	handleSubmit: () => void;
	loading: boolean;
	control?: Control<LoginFormFields>;
	router: NextRouter;
	networkError: ApolloError;
	errors: FieldErrors<{ email: string, password: string }>;
}

export const LoginForm = ({
	control,
	loading,
	handleSubmit,
	router,
	errors,
	networkError,
}: LoginScreenProps) => {
	const [showPass, setShowPass] = React.useState(false);

	return (

		<Center w="100%" height={"100vh"}>
			<Box safeArea p="2" py="8" w="90%" maxW="600">
				<Heading size="2xl" fontWeight="600" color="coolGray.800" textAlign={"center"} _dark={{
					color: "warmGray.50"
				}}>
					Welcome to openTab
				</Heading>
				<Heading mt="2" _dark={{
					color: "warmGray.200"
				}} color="coolGray.600" fontWeight="medium" size="sm" textAlign={"center"}>
					The Smartest and Fastest Way to Order
				</Heading>

				<VStack space={3} mt="5">
					<FormControl>
						<FormControl.Label>Email</FormControl.Label>
						<Controller
							name="email"
							control={control}
							rules={{ required: true, validate: (value) => !!validateEmail(value) }}
							render={({ field }) => {
								return (
									<Input
										{...field}
										type="text"
										bg={'secondary.200'}
										borderColor={errors?.email ? 'red.500' : 'secondary.200'}
										autoCorrect={false}
									/>
								)
							}}
						/>
						<FormControl.Label>Password</FormControl.Label>
						<Controller
							name="password"
							control={control}
							rules={{ required: true, validate: (value) => !!validatePassword(value) }}
							render={({ field }) => {
								return <Input
									{...field}
									bg={'secondary.200'}
									type={showPass ? "text" : "password"}
									InputRightElement={
										<Pressable onPress={() => setShowPass(!showPass)}
											style={{ right: 8, top: 2 }}
										>
											<HideAndShowIcon isHidden={showPass} color={"gray"} size={"1.5em"} />
										</Pressable>
									}
								/>
							}}
						/>
					</FormControl>
					{
						errors?.email || errors?.password || networkError ?
							<Text color={"red.500"}>User or Password Invalid.</Text>
							: null
					}
					<Button mt="2" bg="primary.500" onPress={handleSubmit} isLoading={loading}
					>
						Login here
					</Button>
					<NextLink href={"/business/forgot-password"}>
						<Link _text={{
							fontSize: "sm",
							fontWeight: "500",
							color: "indigo.500"
						}} alignSelf="flex-end" mt="2">
							Forgot Password?
						</Link>
					</NextLink>
					<HStack mt="3" justifyContent="center">
						<Text fontSize="sm" color="coolGray.600" _dark={{
							color: "warmGray.200"
						}}>
							{"I'm a new user. "}
						</Text>
						<Pressable onPress={() => console.log("hello")}>
							<NextLink href={"/business/signup"}>
								<Link _text={{
									fontSize: "sm",
									fontWeight: "500",
									color: "indigo.500"
								}}>
									SignUp
								</Link>
							</NextLink>
						</Pressable>
					</HStack>
				</VStack>
			</Box>
		</Center >);
};


