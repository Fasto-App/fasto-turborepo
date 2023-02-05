import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "app-helpers";
import { useForm } from "react-hook-form";

export const useResetPasswordHook = () => {
  const {
    control,
    handleSubmit,
    formState,
    reset
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      passwordConfirmation: ""
    },
  });

  return {
    control,
    handleSubmit,
    formState,
    reset
  }
}