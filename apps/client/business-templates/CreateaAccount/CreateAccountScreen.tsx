import React from 'react'
import { Center, Box, Heading, VStack, FormControl, Input, HStack, Button, Pressable, Text } from "native-base";
import { Control, Controller, FieldErrors, useForm } from "react-hook-form";
import { businessRoute } from '../../routes';
import { validateEmail, validatePassword } from '../../authUtilities/utils';
import { PasswordIcon } from '../../components/atoms/PasswordIcon';
import { gql, useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { setCookies } from 'cookies-next';
import { useRouter } from 'next/router';
import { z } from 'zod';
import { Link } from '../../components/atoms/Link';
import { CreateAccountConfig, useCreateAccountFormHook } from './hooks';
import { CreateAccountField } from 'app-helpers';
import { ControlledForm, RegularInputConfig } from '../../components/ControlledForm';

const CreatUserMutation = gql`
mutation CreateUser($input: UserInput) {
  createUser(input: $input) {
    _id
    name
    email
    token
  }
}
`
interface CreateUserResponse {
  _id: string,
  name: string,
  email: string,
  token: string
}

interface CreateUserPayload {
  createUser: CreateUserResponse
}

const texts = {
  login: "Login",
  signup: "Sign Up",
  imNewUser: "I'm already a user. ",
  username: "Username",
  createPassword: "Create Password",
  newPassword: "New Password",
  passwordConfirmation: "Password Confirmation",
  pleaseEnterAndConfirm: (email: string) => `Please, enter and confirm your new password for ${email}`,
}

export const CreateAccountScreen = () => {
  const [showPass, setShowPass] = React.useState(false);

  const router = useRouter();
  const { token, email } = router.query;

  const [createUser, { data, loading, error: newtworkError }] = useMutation<CreateUserPayload>(CreatUserMutation);

  const {
    handleSubmit,
    control,
    formState
  } = useCreateAccountFormHook({ email: email as string })

  if (data?.createUser) {
    setCookies("name", data.createUser.name);
    setCookies("token", data.createUser.token);
    setCookies("email", data.createUser.email);
    router.push(businessRoute.dashboard);
  }


  const onSignUpSubmit = (formData: CreateAccountField) => {

    createUser({
      variables: {
        input: {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          passwordConfirmation: formData.passwordConfirmation
        }
      }
    })
  }

  if (data) {
    router.push(businessRoute.dashboard);
    return null;
  }

  if (!router?.query.token || !router?.query.email) {
    return <Text p={"4"} fontSize={"lg"}>Invalid token or email</Text>
  }



  // const isConfirmAccountValid = (passwordConfirmation: string) => control._formValues.password === passwordConfirmation;

  const passwordInputConfig: RegularInputConfig = {
    ...CreateAccountConfig,
    password: {
      ...CreateAccountConfig.password,
      type: showPass ? "text" : "password",
      rightElement: (
        <PasswordIcon
          setShowPass={setShowPass}
          showPassword={showPass}
        />
      ),
    },
    passwordConfirmation: {
      ...CreateAccountConfig.passwordConfirmation,
      type: showPass ? "text" : "password",
      rightElement: (
        <PasswordIcon
          setShowPass={setShowPass}
          showPassword={showPass}
        />
      ),
    }
  }

  return (<Center w="100%" height={"100vh"}>
    <Box safeArea p="2" py="8" w="90%" maxW="600">
      <Heading size="xl" fontWeight="600" color="coolGray.800" textAlign={"center"} _dark={{
        color: "warmGray.50"
      }}>
        {texts.createPassword}
      </Heading>
      <Center>
        <Heading maxWidth={"400px"} mt="2" alignContent={"center"} _dark={{
          color: "warmGray.200"
        }} color="coolGray.600" fontWeight="medium" size="sm" textAlign={"center"}>
          {texts.pleaseEnterAndConfirm(email as string)}
        </Heading>
      </Center>

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
          isLoading={loading}
        >
          {texts.signup}
        </Button>
        <HStack mt="6" justifyContent="center">
          <Text fontSize="sm" color="coolGray.600" _dark={{
            color: "warmGray.200"
          }}>
            {texts.imNewUser}
          </Text>
          <Pressable>
            <Link href={businessRoute.login}>
              {texts.login}
            </Link>
          </Pressable>
        </HStack>
      </VStack>
    </Box>
  </Center >
  )
}

