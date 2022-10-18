import React from 'react'
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { SignUpForm } from "./SignUpForm"
import { gql, useMutation } from '@apollo/client';

// TODO: Add the mutation to create a new user
const requestUserAccountCreationMutation = gql`
mutation RequestUserAccountCreation($input: RequestUserAccountInput) {
  requestUserAccountCreation(input: $input) {
    ok
    url
  }
}
`

export const SignUpBusiness = () => {
  const [requestAccountCreation, { data, loading, error, reset: resetNetwork }] = useMutation<requestUserAccountCreationPayload>(requestUserAccountCreationMutation, {
    onCompleted: (data) => {
      console.log(data)
    }
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      email: '',
      emailConfirmation: '',
    },
  });

  const router = useRouter();
  const onSignUpSubmit = async (formData: SignUpField) => {


    await requestAccountCreation({
      variables: {
        input: {
          email: formData.email,
          emailConfirmation: formData.emailConfirmation,
        }
      }
    })

    resetForm()
  }

  return (
    <SignUpForm
      control={control}
      router={router}
      handleSubmit={handleSubmit(onSignUpSubmit)}
      errors={errors}
      isError={error !== undefined}
      isLoading={loading}
      response={data}
      resetNetwork={resetNetwork}
    />)
}

interface SignUpField {
  email: string;
  emailConfirmation: string;
}

type requestUserAccountCreationPayload = {
  ok: boolean
};