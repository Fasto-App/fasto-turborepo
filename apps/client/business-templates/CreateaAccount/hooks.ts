import { zodResolver } from "@hookform/resolvers/zod";
import { createAccountSchema } from "app-helpers";
import { useForm } from "react-hook-form";
import { RegularInputConfig } from "../../components/ControlledForm";

export const CreateAccountConfig: RegularInputConfig = {
  email: {
    name: "email",
    label: 'Email',
    type: 'text',
    isRequired: true,
    placeholder: 'Email',
    autoComplete: 'email',
    autoFocus: true,
  },
  password: {
    name: "password",
    label: 'Password',
    type: 'password',
    isRequired: true,
    placeholder: 'Password',
    autoComplete: 'password',
    autoFocus: true,
  },
  passwordConfirmation: {
    name: "passwordConfirmation",
    label: 'Password Confirmation',
    type: 'password',
    isRequired: true,
    placeholder: 'Password',
    autoComplete: 'password',
    autoFocus: true,
  },
}

export const useCreateAccountFormHook = ({ email }: { email: string }) => {
  const {
    control,
    handleSubmit,
    formState,
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

  return {
    control,
    handleSubmit,
    formState,
  }
}