import React from 'react'
import { Center, Box, Heading, VStack, Link, HStack, Button, Pressable, Text } from "native-base";
import NextLink from "next/link";
import { businessRoute } from '../../routes';
import { useResetPasswordHook } from './hook';
import { useRouter } from 'next/router';
import { useResetPasswordMutation } from '../../gen/generated';
import { ResetPasswordSchemaInput } from 'app-helpers';
import { setCookies } from '../../cookies/businessCookies';

const texts = {
  resetPassword: "Reset Password",
  pleaseEnterYourPassword: (email: string) => `${email}, Please enter and confirm your new password`,
  newPassword: "New Password",
  reset: "Reset",
  passwordConfirmation: "Password Confirmation",
  passwordConfirmationError: "Password Confirmation does not match",
  passwordError: "Password must be at least 8 characters long",
  goBack: "Go Back",
}

export const ResetPasswordScreen = ({ token, email }: { token: string, email: string }) => {
  const { control, formState, reset, handleSubmit } = useResetPasswordHook()
  const [showPass, setShowPass] = React.useState(false);

  const router = useRouter();
  const [resetPassword] = useResetPasswordMutation({
    onCompleted: (data) => {
      console.log("Reset password completed")
      setCookies("name", data.resetPassword.name);
      setCookies("token", data.resetPassword.token);
      setCookies("email", data.resetPassword.email);
      router.push(businessRoute.dashboard);
    }
  });

  const onResetSubmit = (formData: ResetPasswordSchemaInput) => {
    resetPassword({
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


  return (<Center w="100%" height={"100%"}>
    <Box safeArea p="2" py="8" w="90%" maxW="600">
      <Heading size="xl" fontWeight="600" color="coolGray.800" textAlign={"center"} _dark={{
        color: "warmGray.50"
      }}>
        {texts.resetPassword}
      </Heading>
      <Center>
        <Heading maxWidth={"400px"} mt="2" alignContent={"center"} _dark={{
          color: "warmGray.200"
        }} color="coolGray.600" fontWeight="medium" size="sm" textAlign={"center"}>
          {texts.pleaseEnterYourPassword(email)}
        </Heading>
      </Center>

      <VStack space={3} mt="5">
        <Button mt="2" bg="primary.500" onPress={handleSubmit(onResetSubmit)}>
          Reset
        </Button>
        <HStack mt="6" justifyContent="center">
          <Text fontSize="sm" color="coolGray.600" _dark={{
            color: "warmGray.200"
          }}>
            I'm already a user.{" "}
          </Text>
          <Pressable>
            <NextLink href={businessRoute.login}>
              <Link _text={{
                color: "indigo.500",
                fontWeight: "medium",
                fontSize: "sm"
              }}>
                Login In
              </Link>
            </NextLink>
          </Pressable>
        </HStack>
      </VStack>
    </Box>
  </Center >)
}