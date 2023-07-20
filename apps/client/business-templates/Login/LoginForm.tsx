import React, { useMemo } from 'react';
import { LoginFormFields } from '../types';
import { Center, Box, Heading, VStack, HStack, Text, Button, Image } from "native-base"
import { useRouter } from 'next/router';
import { ControlledForm, RegularInputConfig } from '../../components/ControlledForm';
import { LoginConfig, useLoginFormHook } from './hooks';
import { usePostUserLoginMutation } from '../../gen/generated';
import { setBusinessCookies } from '../../cookies';
import { businessRoute } from 'fasto-route';
import { PasswordIcon } from '../../components/atoms/PasswordIcon';
import { Link } from '../../components/atoms/Link';
import { FDSSelect } from '../../components/FDSSelect';
import { localeObj, Locale } from 'app-helpers';
import { useTranslation } from 'next-i18next';

export const LoginForm = () => {
	const router = useRouter();
	const [showPass, setShowPass] = React.useState(false);
	const [error, setError] = React.useState<string | undefined>(undefined);
	const { t } = useTranslation(["businessLogin", "common"]);

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

	const passwordInputProps: RegularInputConfig = useMemo(() => ({
		...LoginConfig,
		email: {
			...LoginConfig.email,
			label: t("common:email"),
			placeholder: t("common:email"),
		},
		password: {
			...LoginConfig.password,
			type: showPass ? "text" : "password",
			label: t("common:password"),
			placeholder: t("common:password"),
			rightElement: (
				<PasswordIcon
					setShowPass={setShowPass}
					showPassword={showPass}
				/>
			),
		}
	}), [showPass, t]);

	return (
		<Center w="100%" height={"100%"}>
			<Box position={"absolute"} top={"5"} left={"5"}>
				<Image src="/images/fasto-logo.svg"
					alt="Fasto Logo"
					height={36} width={180} />
			</Box>

			<Box position={"absolute"} top={"5"} right={"5"}>
				<FDSSelect
					w="70"
					h="8"
					array={localeObj}
					selectedValue={router.locale as Locale}
					setSelectedValue={(value) => {
						const path = router.asPath;
						return router.push(path, path, { locale: value });
					}} />
			</Box>
			<Box safeArea p="2" py="8" w="90%" maxW="600">
				<Heading size="2xl" fontWeight="600" color="coolGray.800" textAlign={"center"}>
					{t("common:welcomeToFasto")}
				</Heading>
				<Heading mt="2" color="coolGray.600" fontWeight="medium" size="sm" textAlign={"center"}>
					{t("common:theSmartestAndFastestWay")}
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
						{t("businessLogin:loginHere")}
					</Button>

					<Link href={businessRoute['forgot-password']}>
						{t("businessLogin:forgotPassword")}
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
							{t("businessLogin:ImNewUser")}
						</Text>
						<Link href={businessRoute.signup}>
							{t("common:signUp")}
						</Link>
					</HStack>
				</VStack>
			</Box>
		</Center>
	);
};


