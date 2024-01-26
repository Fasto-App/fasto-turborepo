import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "app-helpers";
import { useForm } from "react-hook-form";
import { RegularInputConfig } from "../../components/ControlledForm";

export const ForgotPasswordConfig: RegularInputConfig = {
	email: {
		name: "email",
		label: "Email",
		type: "text",
		isRequired: true,
		placeholder: "Email",
		autoComplete: "email",
		autoFocus: true,
	},
};

export const useForgotPasswordHook = () => {
	const { control, handleSubmit, formState, reset } = useForm({
		mode: "onSubmit",
		reValidateMode: "onChange",
		defaultValues: {
			email: "",
		},
		resolver: zodResolver(forgotPasswordSchema),
	});

	return {
		control,
		handleSubmit,
		formState,
		reset,
	};
};
