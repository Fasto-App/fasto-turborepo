import React from "react"
import router from "next/router";
import NextLink from "next/link";
import { Center, Box, Heading, VStack, FormControl, Input, HStack, Link, Button, Text, Pressable, AlertDialog } from "native-base";
import { Controller } from "react-hook-form";
import { businessRoute } from "../../routes";
import { validateEmail } from "../../authUtilities/utils";

const texts = {
  body: "Enter the e-mail associated with your account and we’ll send you an e-mail with a link to reset your password."
}

export const ForgotPasswordForm = ({ control, handleSubmit, router, errors, resetNetwork, response, networkError }) => {
  const successfull = !!(response?.recoverPassword)
  const cancelRef = React.useRef(null);



  return (
    <Center w="100%" height={"100vh"}>
      <AlertDialog leastDestructiveRef={cancelRef} isOpen={!!successfull} onClose={resetNetwork}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Check Your Email</AlertDialog.Header>
          <AlertDialog.Body>
            We have sent a password reset link to your e-mail.
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button onPress={resetNetwork} ref={cancelRef} colorScheme="green">
                Close
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
      <Box safeArea p="2" py="8" w="90%" maxW="600">

        <Heading size="xl" fontWeight="600" color="coolGray.800" textAlign={"center"} _dark={{
          color: "warmGray.50"
        }}>
          Forgot Password
        </Heading>
        <Center>
          <Heading maxWidth={"400px"} mt="2" _dark={{
            color: "warmGray.200"
          }} color="coolGray.600" fontWeight="medium" size="sm" textAlign={"center"}>
            {texts.body}
          </Heading>
        </Center>

        <VStack space={3} mt="5">
          <FormControl>
            <FormControl.Label>Email</FormControl.Label>
            <Controller
              name="email"
              control={control}
              rules={{ required: true, validate: (value) => !!validateEmail(value) }}
              render={({ field }) => {
                const { ref, ...rest } = field;
                return <Input {...rest} />
              }}
            />

          </FormControl>
          {errors.email && <Text color={"red.500"}>Enter a valid email.</Text>}
          <Button mt="2" bg="primary.500" onPress={handleSubmit}>
            Send Link
          </Button>
          <Pressable>
            <NextLink href={businessRoute.login}>
              <Link alignSelf="flex-end" mt="2" _text={{
                color: "indigo.500",
                fontWeight: "medium",
                fontSize: "sm"
              }}>
                Login
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