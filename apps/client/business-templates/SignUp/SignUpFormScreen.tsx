import React from 'react'
import { Center, Box, Heading, VStack, FormControl, Input, Link, HStack, Button, Pressable, Text, AlertDialog } from "native-base";
import NextLink from "next/link";
import { Controller } from "react-hook-form";
import { businessRoute } from '../../routes';
import { validateEmail } from '../../authUtilities/utils';
import { useSignUpHook } from './hooks';
import { useRequestUserAccountCreationMutation } from '../../gen/generated';
import { SignUpSchemaInput } from 'app-helpers';

export const SignUpFormScreen = () => {
  const cancelRef = React.useRef(null);
  const { control, formState, handleSubmit, reset, } = useSignUpHook()

  const [requestAccountCreation,
    { data, loading, error, reset: resetNetwork }
  ] = useRequestUserAccountCreationMutation()

  const onSignUpSubmit = async (formData: SignUpSchemaInput) => {
    await requestAccountCreation({
      variables: {
        input: {
          email: formData.email,
        }
      }
    })

    reset()
  }

  return (<Center w="100%" height={"100vh"}>
    <AlertDialog leastDestructiveRef={cancelRef} isOpen={data?.requestUserAccountCreation?.ok} onClose={resetNetwork}>
      <AlertDialog.Content>
        <AlertDialog.CloseButton />
        <AlertDialog.Header>Check Your Email</AlertDialog.Header>
        <AlertDialog.Body>
          We have sent a confimation link. Check your Email.
        </AlertDialog.Body>
        <AlertDialog.Footer>
          <Button.Group space={2}>
            <Button onPress={resetNetwork} ref={cancelRef} colorScheme="green">
              Cancel
            </Button>
          </Button.Group>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
    <Box safeArea p="2" py="8" w="90%" maxW="600">
      <Heading size="2xl" fontWeight="600" color="coolGray.800" textAlign={"center"} _dark={{
        color: "warmGray.50"
      }}>
        Welcome to OpenTab
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
              const { ref, ...rest } = field;
              return <Input {...rest} ref={ref} />
            }}
          />
        </FormControl>
        {formState.errors.email ? <Text color={"red.500"}>{"Provide a valid email."}</Text> :
          formState.errors.emailConfirmation ? <Text color={"red.500"}>{"Make sure both emails match."}</Text>
            : error ? <Text color={"red.500"}>{"Something went wrong!"}</Text> : null}

        <Button
          mt="2"
          bg="primary.500"
          onPress={handleSubmit(onSignUpSubmit)}
          isLoading={loading}
        >
          Sign Up
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
                Login
              </Link>
            </NextLink>
          </Pressable>
        </HStack>
      </VStack>
    </Box>
  </Center >)
}