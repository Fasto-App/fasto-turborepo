import React from 'react'
import { Center, Box, Heading, VStack, Link, HStack, Button, Pressable, Text } from "native-base";
import NextLink from "next/link";
import { businessRoute } from '../../routes';
import { ResetPasswordConfig, useResetPasswordHook } from './hook';
import { useRouter } from 'next/router';
import { usePasswordResetMutation } from '../../gen/generated';
import { ResetPasswordSchemaInput } from 'app-helpers';
import { setCookies } from '../../cookies/businessCookies';
import { ControlledForm, RegularInputConfig } from '../../components/ControlledForm';
import { PasswordIcon } from '../../components/atoms/PasswordIcon';

const texts = {
  resetPassword: "Reset Password",
  imAlreadyAUser: "I'm already a user ",
  pleaseEnterYourPassword: (email: string) => `${email}, Please enter and confirm your new password`,
  newPassword: "New Password",
  reset: "Reset",
  passwordConfirmation: "Password Confirmation",
  passwordConfirmationError: "Password Confirmation does not match",
  passwordError: "Password must be at least 8 characters long",
  goBack: "Go Back",
  login: "Login",
}

export const ResetPasswordScreen = ({ token, email }: { token: string, email: string }) => {
  const { control, formState, reset, handleSubmit } = useResetPasswordHook()
  const [showPass, setShowPass] = React.useState(false);

  const router = useRouter();
  const [resetPassword, { loading }] = usePasswordResetMutation({
    onCompleted: (data) => {
      console.log("Reset password completed")

      const { token, email, name } = data.passwordReset;
      setCookies("token", token);
      email && setCookies("email", email);
      name && setCookies("name", name);

      router.push(businessRoute.dashboard);
    }
  });

  const onResetSubmit = async (formData: ResetPasswordSchemaInput) => {

    await resetPassword({
      variables: {
        input: {
          password: formData.password,
          passwordConfirmation: formData.passwordConfirmation,
          token,
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
      rightElement: (
        <PasswordIcon
          setShowPass={setShowPass}
          showPassword={showPass}
        />
      ),
    }
  };


  return (<Center w="100%" height={"100%"}>
    <Box safeArea p="2" py="8" w="90%" maxW="600">
      <Heading size="xl" fontWeight="600" color="coolGray.800" textAlign={"center"} _dark={{
        color: "warmGray.50"
      }}>
        {texts.resetPassword}
      </Heading>
      <Center>
        <Heading maxWidth={"400px"} mt="2" alignContent={"center"} color="coolGray.600" fontWeight="medium" size="sm" textAlign={"center"}>
          {texts.pleaseEnterYourPassword(email)}
        </Heading>
      </Center>
      <ControlledForm
        control={control}
        formState={formState}
        Config={passwordInputProps}
      />

      <VStack space={3} mt="5">
        <Button isLoading={loading} mt="2" bg="primary.500" onPress={handleSubmit(onResetSubmit)}>
          {texts.reset}
        </Button>
        <HStack mt="6" justifyContent="center">
          <Text fontSize="sm" color="coolGray.600">
            {texts.imAlreadyAUser}
          </Text>
          <Pressable>
            <NextLink href={businessRoute.login}>
              <Link _text={{
                color: "indigo.500",
                fontWeight: "medium",
                fontSize: "sm"
              }}>
                {texts.login}
              </Link>
            </NextLink>
          </Pressable>
        </HStack>
      </VStack>
    </Box>
  </Center>
  )
}