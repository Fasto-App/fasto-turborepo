import { useForm } from "react-hook-form";
import { SideBySideInputConfig } from "../../components/ControlledForm";

export const SignUpConfig: SideBySideInputConfig = {
  email: {
    name: "email",
    label: 'Email',
    type: 'text',
    placeholder: 'Email',
    isRequired: true,
  },
  emailConfirmation: {
    name: "emailConfirmation",
    label: 'Email Confirmation',
    type: 'text',
    placeholder: 'Email Confirmation',
    isRequired: true,
  },
}

export const useSignUpHook = () => {
  const {
    control,
    handleSubmit,
    formState,
    reset,
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      email: '',
      emailConfirmation: '',
    },
  });

  return {
    control,
    handleSubmit,
    formState,
    reset,
  }
}