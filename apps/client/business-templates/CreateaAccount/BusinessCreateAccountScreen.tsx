import React from "react"
import { gql, useMutation } from "@apollo/client";
import { Text } from "native-base";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { businessRoute } from "../../routes";
import { CreateAccountScreen } from "./CreateAccountScreen"
import { setCookies } from "../../cookies/businessCookies";


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

export const BusinessCreateAccountScreen = () => {
  const router = useRouter();
  const { token, email } = router.query;

  const [createUser, { data, loading, error: newtworkError }] = useMutation<CreateUserPayload>(CreatUserMutation);

  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      "name": email,
      "email": email,
      "password": "",
      "passwordConfirmation": ""
    },
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

  return (
    <CreateAccountScreen
      control={control}
      router={router}
      handleSubmit={handleSubmit(onSignUpSubmit)}
      errors={errors}
      email={email}
      newtworkError={newtworkError}
    // onClearErrors={clearErrors}
    />)
}

interface CreateAccountField {
  name: string,
  email: string,
  password: string,
  passwordConfirmation: string
}

interface CreateUserResponse {
  _id: string,
  name: string,
  email: string,
  token: string
}

interface CreateUserPayload {
  createUser: CreateUserResponse
}
