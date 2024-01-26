import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "app-helpers";
import { useForm } from "react-hook-form";
import { RegularInputConfig } from "../../components/ControlledForm";

export const LoginConfig: RegularInputConfig = {
	email: {
		name: "email",
		label: "Email",
		type: "text",
		isRequired: true,
		placeholder: "Email",
		autoComplete: "email",
		autoFocus: true,
	},
	password: {
		name: "password",
		label: "Password",
		type: "password",
		isRequired: true,
		placeholder: "Password",
		autoComplete: "password",
		autoFocus: true,
	},
};

export const useLoginFormHook = () => {
	const { control, handleSubmit, formState } = useForm({
		mode: "onSubmit",
		reValidateMode: "onChange",
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	return {
		control,
		handleSubmit,
		formState,
	};
};
