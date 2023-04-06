import React from 'react';
import NextLink from 'next/link';
import { LoginFormFields } from '../types';
import { Center, Box, Heading, VStack, HStack, Text, Button, } from "native-base"
import { useRouter } from 'next/router';
import { ControlledForm, RegularInputConfig } from '../../components/ControlledForm';
import { LoginConfig, useLoginFormHook } from './hooks';
import { usePostUserLoginMutation } from '../../gen/generated';
import { setBusinessCookies } from '../../cookies';
import { businessRoute } from '../../routes';
import { PasswordIcon } from '../../components/atoms/PasswordIcon';
import { Link } from '../../components/atoms/Link';

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
	const [error, setError] = React.useState<string | undefined>(undefined);

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

			setBusinessCookies("token", token);
			router.push(businessRoute.dashboard);
		},
		onError: (error) => {
			console.log("ERROR", error.cause)
			setError(error.cause as string || "Something went wrong!")
		}
	})

	const onSubmit = async (formData: LoginFormFields) => {
		setError(undefined);

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

	const passwordInputProps: RegularInputConfig = {
		...LoginConfig,
		password: {
			...LoginConfig.password,
			type: showPass ? "text" : "password",
			rightElement: (
				<PasswordIcon
					setShowPass={setShowPass}
					showPassword={showPass}
				/>
			),
		}
	};


	return (
		<Center w="100%" height={"100vh"}>
			<Box safeArea p="2" py="8" w="90%" maxW="600">
				<Heading size="2xl" fontWeight="600" color="coolGray.800" textAlign={"center"}>
					{texts.welcomeToFasto}
				</Heading>
				<Heading mt="2" color="coolGray.600" fontWeight="medium" size="sm" textAlign={"center"}>
					{texts.theSmartestAndFastestWay}
				</Heading>
				<VStack space={3} mt="5">
					<ControlledForm
						control={control}
						formState={formState}
						Config={passwordInputProps}
					/>
					<Button
						mt="2"
						bg="primary.500"
						onPress={handleSubmit(onSubmit)}
						isLoading={loading}
					>
						{texts.loginHere}
					</Button>

					<Link href={businessRoute.forgotPassword}>
						{texts.forgotPassword}
					</Link>
					{error ?
						<Text
							mt="2"
							fontSize="sm"
							color="red.500"
							textAlign={"center"}
						>
							{error}
						</Text> : null}
					<HStack mt="3" justifyContent="center">
						<Text
							fontSize="sm"
							color="coolGray.600"
						>
							{texts.ImNewUser}
						</Text>
						<Link href={businessRoute.signup}>
							{texts.signup}
						</Link>

					</HStack>
				</VStack>
			</Box>
		</Center>
	);
};


