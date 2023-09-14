import React from 'react'
import { Center, Box, Heading, VStack, Link, HStack, Button, Pressable, Text, Image } from "native-base";
import NextLink from "next/link";
import { businessRoute } from 'fasto-route';
import { ResetPasswordConfig, useResetPasswordHook } from './hook';
import { useRouter } from 'next/router';
import { usePasswordResetMutation } from '../../gen/generated';
import { Locale, ResetPasswordSchemaInput, localeObj } from 'app-helpers';
import { setBusinessCookies } from '../../cookies';
import { ControlledForm, RegularInputConfig } from '../../components/ControlledForm';
import { PasswordIcon } from '../../components/atoms/PasswordIcon';
import { useTranslation } from 'next-i18next';
import { FDSSelect } from '../../components/FDSSelect';

export const ResetPasswordScreen = () => {
  const { control, formState, reset, handleSubmit } = useResetPasswordHook()
  const [showPass, setShowPass] = React.useState(false);

  const { query } = useRouter();
  const { email, token } = query;

  const { t } = useTranslation(["businessResetPassword", "common"])

  const router = useRouter();
  const [resetPassword, { loading }] = usePasswordResetMutation({
    onCompleted: (data) => {
      console.log("Reset password completed")

      const { token } = data.passwordReset;
      setBusinessCookies("token", token);

      router.push(businessRoute.dashboard);
    }
  });

  const onResetSubmit = async (formData: ResetPasswordSchemaInput) => {
    if (!token) throw new Error("Token is required");

    await resetPassword({
      variables: {
        input: {
          password: formData.password,
          passwordConfirmation: formData.passwordConfirmation,
          token: typeof token === "string" ? token : token[0],
        }
      }
    })

    reset();
  }

  const passwordInputProps: RegularInputConfig = {
    ...ResetPasswordConfig,
    password: {
      ...ResetPasswordConfig.password,
      type: showPass ? "text" : "password",
      placeholder: t("common:password"),
      label: t("common:password"),
      rightElement: (
        <PasswordIcon
          setShowPass={setShowPass}
          showPassword={showPass}
        />
      ),
    },
    passwordConfirmation: {
      ...ResetPasswordConfig.passwordConfirmation,
      type: showPass ? "text" : "password",
      placeholder: t("common:passwordConfirmation"),
      label: t("common:passwordConfirmation"),
      rightElement: (
        <PasswordIcon
          setShowPass={setShowPass}
          showPassword={showPass}
        />
      ),
    }
  };

  if (!email || !token) return <Center><Text>{t("businessResetPassword:goBack")}</Text></Center>

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
        <Heading size="xl" fontWeight="600" color="coolGray.800" textAlign={"center"} _dark={{
          color: "warmGray.50"
        }}>
          {t("businessResetPassword:resetPassword")}
        </Heading>
        <Center>
          <Heading maxWidth={"400px"} mt="2" alignContent={"center"} color="coolGray.600" fontWeight="medium" size="sm" textAlign={"center"}>
            {t("businessResetPassword:pleaseEnterYourPassword", { email: typeof email === "string" ? email : email[0] })}
          </Heading>
        </Center>
        <ControlledForm
          control={control}
          formState={formState}
          Config={passwordInputProps}
        />
        <VStack space={3} mt="5">
          <Button isLoading={loading} mt="2" bg="primary.500" onPress={handleSubmit(onResetSubmit)}>
            {t("businessResetPassword:reset")}
          </Button>
          <HStack mt="6" justifyContent="center">
            <Text fontSize="sm" color="coolGray.600">
              {t("common:imAlreadyAUser")}
            </Text>
            <Pressable>
              <NextLink href={businessRoute.login}>
                <Link _text={{
                  color: "indigo.500",
                  fontWeight: "medium",
                  fontSize: "sm"
                }}>
                  {t("common:login")}
                </Link>
              </NextLink>
            </Pressable>
          </HStack>
        </VStack>
      </Box>
    </Center>
  )
}