import React from "react"
import router from "next/router";
import NextLink from "next/link";
import { Center, Box, Heading, VStack, FormControl, Input, HStack, Link, Button, Text, Pressable, AlertDialog } from "native-base";
import { businessRoute } from "../../routes";
import { validateEmail } from "../../authUtilities/utils";
import { ControlledForm } from "../../components/ControlledForm";
import { ForgotPasswordConfig, useForgotPasswordHook } from "./hooks";
import { forgotPasswordSchemaInput } from "app-helpers";
import { useRecoverPasswordMutation } from "../../gen/generated";

const texts = {
  body: "Enter the e-mail associated with your account and we'll send you an e-mail with a link to reset your password.",
  checkYourEmail: "Check your email",
  weHaveSent: "We have sent a password reset link to your e-mail.",
  close: "Close",
  forgotPassoword: "Forgot Password",
  sendLink: "Send Link",
  login: "login"
}

export const ForgotPasswordForm = () => {

  const {
    control,
    formState,
    handleSubmit,
    reset,
  } = useForgotPasswordHook()

  const [recoverPasswordMutation, { data: response, reset: resetNetwork }] = useRecoverPasswordMutation()

  const handleResetPress = (data: forgotPasswordSchemaInput) => {
    recoverPasswordMutation({
      variables: {
        input: data.email.trim().toLocaleLowerCase()
      }
    })

    reset()
  }



  const successfull = !!(response?.recoverPassword)
  const cancelRef = React.useRef(null);

  return (
    <Center w="100%" height={"100vh"}>
      <AlertDialog leastDestructiveRef={cancelRef} isOpen={!!successfull} onClose={resetNetwork}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>{texts.checkYourEmail}</AlertDialog.Header>
          <AlertDialog.Body>
            {texts.weHaveSent}
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button onPress={resetNetwork} ref={cancelRef} colorScheme="green">
                {texts.close}
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
      <Box safeArea p="2" py="8" w="90%" maxW="600">

        <Heading size="xl" fontWeight="600" color="coolGray.800" textAlign={"center"}>
          {texts.forgotPassoword}
        </Heading>
        <Center>
          <Heading maxWidth={"400px"} mt="2" color="coolGray.600" fontWeight="medium" size="sm" textAlign={"center"}>
            {texts.body}
          </Heading>
        </Center>

        <VStack space={3} mt="5">
          <ControlledForm
            control={control}
            formState={formState}
            Config={ForgotPasswordConfig}
          />
          <Button mt="2" bg="primary.500" onPress={handleSubmit(handleResetPress)}>
            {texts.sendLink}
          </Button>
          <Pressable>
            <NextLink href={businessRoute.login}>
              <Link alignSelf="flex-end" mt="2" _text={{
                color: "indigo.500",
                fontWeight: "medium",
                fontSize: "sm"
              }}>
                {texts.login}
              </Link>
            </NextLink>
          </Pressable>
          <HStack mt="6" justifyContent="center">
          </HStack>
        </VStack>
      </Box>
    </Center>
  )
}