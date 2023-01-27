import React from 'react'
import { Center, Box, Heading, VStack, FormControl, Input, Link, HStack, Button, Pressable, Text, Hidden } from "native-base";
import NextLink from "next/link";
import { Control, Controller, FieldErrors, useForm } from "react-hook-form";
import { businessRoute } from '../../routes';
import { validateEmail, validatePassword } from '../../authUtilities/utils';
import { HideAndShowIcon } from '../../components/atoms/HideAndShowIcon';
import { gql, useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { setCookies } from 'cookies-next';
import { useRouter } from 'next/router';
import { z } from 'zod';

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

type CreateAccountField = z.infer<typeof createAccountSchema>

type CreateAccountScreenErrors = FieldErrors<{
  password: string;
  passwordConfirmation: string;
}>

type CreateAccountScreenControl = Control<{
  password: string;
  passwordConfirmation: string;
}, object>

const createAccountSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(50),
  passwordConfirmation: z.string().min(8).max(50),
});

export const CreateAccountScreen = () => {
  const [showPass, setShowPass] = React.useState(false);

  const router = useRouter();
  const { token, email } = router.query;

  const [createUser, { data, loading, error: newtworkError }] = useMutation<CreateUserPayload>(CreatUserMutation);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      name: email as string,
      email: email as string,
      password: "",
      passwordConfirmation: ""
    },
    resolver: zodResolver(createAccountSchema)
  });

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



  const isConfirmAccountValid = (passwordConfirmation: string) => control._formValues.password === passwordConfirmation;


  return (<Center w="100%" height={"100vh"}>
    <Box safeArea p="2" py="8" w="90%" maxW="600">
      <Heading size="xl" fontWeight="600" color="coolGray.800" textAlign={"center"} _dark={{
        color: "warmGray.50"
      }}>
        Create Password
      </Heading>
      <Center>
        <Heading maxWidth={"400px"} mt="2" alignContent={"center"} _dark={{
          color: "warmGray.200"
        }} color="coolGray.600" fontWeight="medium" size="sm" textAlign={"center"}>
          {`Please, enter and confirm your new password for ${email}`}
        </Heading>
      </Center>

      <VStack space={3} mt="5">

        {/* Email */}
        <FormControl>
          <Controller
            name="email"
            defaultValue={email as string}
            control={control}
            // @ts-ignore
            rules={{ required: true, validate: (value) => validateEmail(value) }}
            render={({ field }) => {
              const { ref, ...rest } = field;
              return <Input {...rest} ref={ref} value={email as string} display="none" />
            }}
          />
          <FormControl.Label>User id</FormControl.Label>
          <Controller
            name="name"
            control={control}
            rules={{ required: true, validate: (value) => value.trim() && value.length > 5 }}
            render={({ field }) => {
              const { ref, ...rest } = field;
              return <Input {...rest} ref={ref} />
            }}
          />

          {/* NEW PASSWORD */}
          <FormControl.Label>New Password</FormControl.Label>
          <Controller
            name="password"
            control={control}
            rules={{ required: true, validate: (value) => validatePassword(value) }}
            render={({ field }) => {
              return (
                <Input {...field}
                  type={showPass ? "text" : "password"}
                  InputRightElement={
                    <Pressable onPress={() => setShowPass(!showPass)}
                      style={{ right: 8, top: 2 }}
                    >
                      <HideAndShowIcon isHidden={showPass} color={"gray"} size={"1.5em"} />
                    </Pressable>
                  }
                />
              )
            }}
          />
          {/* REPETE PASSWORD */}
          <FormControl.Label>Password Confirmation</FormControl.Label>
          <Controller
            name="passwordConfirmation"
            control={control}
            rules={{ required: true, validate: (value) => validatePassword(value) && isConfirmAccountValid(value) }}
            render={({ field }) => {
              const { ref, ...rest } = field;
              return (
                <Input {...rest} ref={ref}
                  type={showPass ? `text` : `password`}
                  InputRightElement={
                    <Pressable
                      onPress={() => setShowPass(!showPass)}
                      style={{ right: 8, top: 2 }}
                    >
                      <HideAndShowIcon isHidden={showPass} color={"gray"} size={"1.5em"} />
                    </Pressable>
                  }
                />
              )
            }}
          />
        </FormControl>
        {errors.password ?
          <Text color={"red.500"}>{"Provide a valid password. At leat 8 characters, mixing letter and numbers."}</Text> :
          errors.passwordConfirmation ?
            <Text color={"red.500"}>{"Make sure both passwords match."}</Text> :
            errors.email ?
              <Text color={"red.500"}>{"Provide a valid email."}</Text> :
              newtworkError ?
                <Text color={"red.500"}>{"Something went wrong while creating your account. Please, try it again."}</Text> :
                null}
        <Button mt="2" bg="primary.500" onPress={handleSubmit(onSignUpSubmit)}>
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
                Login In
              </Link>
            </NextLink>
          </Pressable>
        </HStack>
      </VStack>
    </Box>
  </Center >)
}

