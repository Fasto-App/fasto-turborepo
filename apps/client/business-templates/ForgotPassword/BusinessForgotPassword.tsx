import React from 'react';
import { useRouter } from "next/router"
import { useForm } from "react-hook-form";
import { ForgotPasswordForm } from "./ForgotPasswordForm"
import { validateEmail } from '../../authUtilities/utils';
import { gql, useMutation } from '@apollo/client';

const requestPasswordResetMutation = gql`
mutation RecoverPassword($input: String!) {
  recoverPassword(input: $input) {
    ok
  }
}
`

export const BusinessForgotPassword = () => {
  const [recoverPasswordMutation, { data, loading, error, reset: resetNetwork }] = useMutation<requestResetPassword>(requestPasswordResetMutation);

  const router = useRouter()
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      email: ''
    },
  });

  const handleResetPress = (data: { email: string }) => {
    recoverPasswordMutation({
      variables: {
        input: data.email.trim().toLocaleLowerCase()
      }
    })

    reset()
  }

  return <ForgotPasswordForm
    router={router}
    control={control}
    handleSubmit={handleSubmit(handleResetPress)}
    errors={errors}
    response={data}
    resetNetwork={resetNetwork}
    networkError={null}
  />

}

type requestResetPassword = {
  recoverPassword: {
    ok: boolean
  }
}