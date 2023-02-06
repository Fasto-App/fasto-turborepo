import React from 'react';
import NextLink from 'next/link';
import { Control, FieldErrors } from 'react-hook-form';
import { LoginFormFields } from '../types';
import { Center, Box, Heading, VStack, HStack, Link, Text, Button, } from "native-base"
import { Pressable } from 'react-native';
import { NextRouter, useRouter } from 'next/router';
import { ApolloError } from '@apollo/client';
import { ControlledForm } from '../../components/ControlledForm';
import { LoginConfig, useLoginFormHook } from './hooks';
import { usePostUserLoginMutation } from '../../gen/generated';
import { setCookies } from '../../cookies/businessCookies';
import { businessRoute } from '../../routes';

const texts = {
	welcomeToFasto: "Welcome to openTab",
	theSmartestAndFastestWay: "The Smartest and Fastest Way to Order",
	ImNewUser: "I'm a new user ",
	loginHere: "Login Here",
	login: "Login",
	signup: "Sign Up",
	forgotPassword: "Forgot Password?",
};

export const LoginForm = () => {
	const router = useRouter();
	const [showPass, setShowPass] = React.useState(false);

	const {
		control,
		handleSubmit,
		formState,
	} = useLoginFormHook();

	const [postUserLogin, { loading }] = usePostUserLoginMutation({
		onCompleted: (data) => {
			const { name, email, token } = data.postUserLogin;

			if (!name || !email || !token) {
				throw new Error("Invalid data returned from server")
			}

			setCookies("name", name);
			setCookies("token", token);
			setCookies("email", email);
			router.push(businessRoute.dashboard);
		}
	})

	const onSubmit = async (formData: LoginFormFields) => {

		try {
			await postUserLogin({
				variables: {
					input: {
						email: formData.email,
						password: formData.password,
					},
				},
			});
		} catch {
			console.log("ERROR")
		}
	};

	return (
		<Center w="100%" height={"100vh"}>
			<Box safeArea p="2" py="8" w="90%" maxW="600">
				<Heading size="2xl" fontWeight="600" color="coolGray.800" textAlign={"center"} _dark={{
					color: "warmGray.50"
				}}>
					{texts.welcomeToFasto}
				</Heading>
				<Heading mt="2" _dark={{
					color: "warmGray.200"
				}} color="coolGray.600" fontWeight="medium" size="sm" textAlign={"center"}>
					{texts.theSmartestAndFastestWay}
				</Heading>

				<VStack space={3} mt="5">

					<ControlledForm
						control={control}
						formState={formState}
						Config={LoginConfig}
					/>
					<Button
						mt="2"
						bg="primary.500"
						onPress={handleSubmit(onSubmit)}
						isLoading={loading}
					>
						{texts.loginHere}
					</Button>
					<NextLink href={"/business/forgot-password"}>
						<Link _text={{
							fontSize: "sm",
							fontWeight: "500",
							color: "indigo.500"
						}} alignSelf="flex-end" mt="2">
							{texts.forgotPassword}
						</Link>
					</NextLink>
					<HStack mt="3" justifyContent="center">
						<Text fontSize="sm" color="coolGray.600" _dark={{
							color: "warmGray.200"
						}}>
							{texts.ImNewUser}
						</Text>
						<Pressable onPress={() => console.log("hello")}>
							<NextLink href={"/business/signup"}>
								<Link _text={{
									fontSize: "sm",
									fontWeight: "500",
									color: "indigo.500"
								}}>
									{texts.signup}
								</Link>
							</NextLink>
						</Pressable>
					</HStack>
				</VStack>
			</Box>
		</Center >
	);
};


