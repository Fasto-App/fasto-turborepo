import React from "react"
import { setCookies } from 'cookies-next';
import { gql, useMutation } from "@apollo/client";
import { Text } from "native-base";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { businessRoute } from "../../routes";
import { ResetPasswordScreen } from "./ResetPasswordScreen"


const UpdateUserInformationMutation = gql`
mutation UpdateUserInformation($input: UpdateUserInput!) {
  updateUserInformation(input: $input) {
    token
    privileges
    email
    name
    _id
  }
}
`

export const BusinessResetPassword = ({ _id, email }) => {

  const router = useRouter();

  const [resetPassword, { data, loading, error: newtworkError }] = useMutation<UpdateUserInformation>(UpdateUserInformationMutation);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      "password": "",
      "passwordConfirmation": ""
    },
  });

  if (data?.updateUserInformation) {
    setCookies("opentab-cookies-name", data.updateUserInformation.name);
    setCookies("opentab-cookies-token", data.updateUserInformation.token);
    setCookies("opentab-cookies-email", data.updateUserInformation.email);
    router.push(businessRoute.dashboard);
  }

  const onResetSubmit = (formData: UpdatePasswordField) => {


    resetPassword({
      variables: {
        input: {
          _id,
          password: formData.password,
          passwordConfirmation: formData.passwordConfirmation
        }
      }
    })

    reset();
  }

  return (
    <ResetPasswordScreen
      email={email}
      control={control}
      handleSubmit={handleSubmit(onResetSubmit)}
      errors={errors}
      newtworkError={newtworkError}
    />)
}

interface UpdatePasswordField {
  _id: string;
  password: string,
  passwordConfirmation: string
}

interface updateUserInformationResponse {
  _id: string,
  name: string,
  email: string,
  token: string
}

interface UpdateUserInformation {
  updateUserInformation: updateUserInformationResponse
}
