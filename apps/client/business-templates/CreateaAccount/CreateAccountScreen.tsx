import React, { useEffect } from 'react'
import { Center, Box, Heading, VStack, HStack, Button, Pressable, Text } from "native-base";
import { businessRoute } from '../../routes';
import { PasswordIcon } from '../../components/atoms/PasswordIcon';
import { setBusinessCookies } from '../../cookies';
import { useRouter } from 'next/router';
import { Link } from '../../components/atoms/Link';
import { CreateAccountConfig, useCreateAccountFormHook } from './hooks';
import { CreateAccountField } from 'app-helpers';
import { ControlledForm, RegularInputConfig } from '../../components/ControlledForm';
import { useCreateEmployeeAccountMutation, useCreateUserMutation } from '../../gen/generated';
import { DevTool } from '@hookform/devtools';

const texts = {
  login: "Login",
  signup: "Sign Up",
  imNewUser: "I'm already a user. ",
  username: "Username",
  createPassword: "Create Password",
  newPassword: "New Password",
  invalidTokenOrEmail: "Invalid token or email",
  passwordConfirmation: "Password Confirmation",
  pleaseEnterAndConfirm: (email: string) => `Please, enter and confirm your new password for ${email}`,
  yourBusiness: (businessName: string) => `Your Business ${businessName}© is waiting for you.`,
}

export const CreateAccountScreen = () => {
  const [showPass, setShowPass] = React.useState(false);

  const router = useRouter();
  const { token, email, business } = router.query;

  const [createUser, { loading }] = useCreateUserMutation({
    onCompleted: (data) => {
      const { token, email, name } = data.createUser;
      setBusinessCookies("token", token);

      router.push(businessRoute.dashboard);
    }
  })

  const [createEmployeeAccount, { loading: employeeLoading }] = useCreateEmployeeAccountMutation({
    onCompleted: (data) => {
      const { token } = data.createEmployeeAccount;
      setBusinessCookies("token", token);

      router.push(businessRoute.dashboard);
    }
  });

  const {
    handleSubmit,
    control,
    formState,
    setValue
  } = useCreateAccountFormHook(email as string)

  useEffect(() => {
    if (typeof email === "string") {
      setValue("email", email)
    }
  }, [email, setValue])

  const onSignUpSubmit = async (formData: CreateAccountField) => {
    if (business) {
      return await createEmployeeAccount({
        variables: {
          input: {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            passwordConfirmation: formData.passwordConfirmation,
            token: token as string
          }
        }
      })
    }

    await createUser({
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

  if (!token || !email) {
    return <Text
      p={"4"}
      fontSize={"lg"}
    >
      {texts.invalidTokenOrEmail}
    </Text>
  }

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
        {business ? <Heading maxWidth={"400px"} mt="2" alignContent={"center"} _dark={{
          color: "warmGray.200"
        }} color="coolGray.600" fontWeight="medium" size="sm" textAlign={"center"}>
          {texts.yourBusiness(business as string)}
        </Heading> : null}
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
  </Center>
  )
}

