import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "app-helpers";
import { useForm } from "react-hook-form";
import { RegularInputConfig } from "../../components/ControlledForm";

export const ResetPasswordConfig: RegularInputConfig = {
	password: {
		name: "password",
		type: "password",
		label: "Password",
		placeholder: "Enter your password",
		isRequired: true,
	},
	passwordConfirmation: {
		name: "passwordConfirmation",
		type: "password",
		label: "Password Confirmation",
		placeholder: "Enter your password confirmation",
		isRequired: true,
	},
};

export const useResetPasswordHook = () => {
	const { control, handleSubmit, formState, reset } = useForm({
		mode: "onSubmit",
		reValidateMode: "onSubmit",
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			password: "",
			passwordConfirmation: "",
		},
	});

	return {
		control,
		handleSubmit,
		formState,
		reset,
	};
};
