import React, { useEffect, useMemo } from "react";
import {
	Center,
	Box,
	Heading,
	VStack,
	HStack,
	Button,
	Pressable,
	Text,
	Image,
} from "native-base";
import { businessRoute } from "fasto-route";
import { PasswordIcon } from "../../components/atoms/PasswordIcon";
import { setBusinessCookies } from "../../cookies";
import { useRouter } from "next/router";
import { Link } from "../../components/atoms/Link";
import { CreateAccountConfig, useCreateAccountFormHook } from "./hooks";
import { CreateAccountField } from "app-helpers";
import {
	ControlledForm,
	RegularInputConfig,
} from "../../components/ControlledForm";
import {
	useCreateEmployeeAccountMutation,
	useCreateUserMutation,
} from "../../gen/generated";
import { DevTool } from "@hookform/devtools";
import { useTranslation } from "next-i18next";

export const CreateAccountScreen = () => {
	const [showPass, setShowPass] = React.useState(false);

	const router = useRouter();
	const { token, email, business } = router.query;
	const { t } = useTranslation(["businessCreateAccount", "common"]);

	const [createUser, { loading }] = useCreateUserMutation({
		onCompleted: (data) => {
			const { token, email, name } = data.createUser;
			setBusinessCookies("token", token);

			router.push(businessRoute.dashboard);
		},
	});

	const [createEmployeeAccount, { loading: employeeLoading }] =
		useCreateEmployeeAccountMutation({
			onCompleted: (data) => {
				const { token } = data.createEmployeeAccount;
				setBusinessCookies("token", token);

				router.push(businessRoute.dashboard);
			},
		});

	const { handleSubmit, control, formState, setValue } =
		useCreateAccountFormHook(email as string);

	useEffect(() => {
		if (typeof email === "string") {
			setValue("email", email);
		}
	}, [email, setValue]);

	const onSignUpSubmit = async (formData: CreateAccountField) => {
		if (business) {
			return await createEmployeeAccount({
				variables: {
					input: {
						name: formData.name,
						email: formData.email,
						password: formData.password,
						passwordConfirmation: formData.passwordConfirmation,
						token: token as string,
					},
				},
			});
		}

		await createUser({
			variables: {
				input: {
					name: formData.name,
					email: formData.email,
					password: formData.password,
					passwordConfirmation: formData.passwordConfirmation,
					country: formData.country,
				},
			},
		});
	};

	const passwordInputConfig: RegularInputConfig = useMemo(
		() => ({
			...CreateAccountConfig,
			password: {
				...CreateAccountConfig.password,
				type: showPass ? "text" : "password",
				placeholder: t("common:password"),
				label: t("common:password"),
				rightElement: (
					<PasswordIcon setShowPass={setShowPass} showPassword={showPass} />
				),
			},
			passwordConfirmation: {
				...CreateAccountConfig.passwordConfirmation,
				type: showPass ? "text" : "password",
				placeholder: t("common:passwordConfirmation"),
				label: t("common:passwordConfirmation"),
				rightElement: (
					<PasswordIcon setShowPass={setShowPass} showPassword={showPass} />
				),
			},
			name: {
				...CreateAccountConfig.name,
				placeholder: t("common:businessName"),
				label: t("common:businessName"),
			},
		}),
		[showPass, t],
	);

	if (!token || !email) {
		return (
			<Text p={"4"} fontSize={"lg"}>
				{t("businessCreateAccount:invalidTokenOrEmail")}
			</Text>
		);
	}

	return (
		<Center w="100%" height={"100vh"}>
			<Box position={"absolute"} top={"5"} left={"5"}>
				<Image
					src="/images/fasto-logo.svg"
					alt="Fasto Logo"
					height={36}
					width={180}
				/>
			</Box>
			<Box safeArea p="2" py="8" w="90%" maxW="600">
				<Heading
					size="xl"
					fontWeight="600"
					color="coolGray.800"
					textAlign={"center"}
					_dark={{
						color: "warmGray.50",
					}}
				>
					{t("businessCreateAccount:createPassword")}
				</Heading>
				<Center>
					<Heading
						maxWidth={"400px"}
						mt="2"
						alignContent={"center"}
						_dark={{
							color: "warmGray.200",
						}}
						color="coolGray.600"
						fontWeight="medium"
						size="sm"
						textAlign={"center"}
					>
						{t("businessCreateAccount:pleaseEnterAndConfirm", { email })}
					</Heading>
					{business ? (
						<Heading
							maxWidth={"400px"}
							mt="2"
							alignContent={"center"}
							_dark={{
								color: "warmGray.200",
							}}
							color="coolGray.600"
							fontWeight="medium"
							size="sm"
							textAlign={"center"}
						>
							{t("businessCreateAccount:yourBusiness", {
								businessName: business,
							})}
						</Heading>
					) : null}
				</Center>
				<DevTool control={control} />
				<ControlledForm
					control={control}
					formState={formState}
					Config={passwordInputConfig}
				/>
				<VStack space={3} mt="5">
					<Button
						mt="2"
						bg="primary.500"
						onPress={handleSubmit(onSignUpSubmit)}
						isLoading={loading || employeeLoading}
					>
						{t("businessCreateAccount:signup")}
					</Button>
					<HStack mt="6" justifyContent="center">
						<Text
							fontSize="sm"
							color="coolGray.600"
							_dark={{
								color: "warmGray.200",
							}}
						>
							{t("businessCreateAccount:imNewUser")}
						</Text>
						<Pressable>
							<Link href={businessRoute.login}>{t("login")}</Link>
						</Pressable>
					</HStack>
				</VStack>
			</Box>
		</Center>
	);
};
