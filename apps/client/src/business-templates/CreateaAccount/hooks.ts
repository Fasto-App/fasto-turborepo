import { zodResolver } from "@hookform/resolvers/zod";
import { createAccountSchema } from "app-helpers";
import { useForm } from "react-hook-form";
import { RegularInputConfig } from "../../components/ControlledForm";

export const CreateAccountConfig: RegularInputConfig = {
	name: {
		name: "name",
		label: "Username",
		type: "text",
		isRequired: true,
		autoFocus: true,
	},
	password: {
		name: "password",
		label: "Password",
		isRequired: true,
		placeholder: "Password",
		autoComplete: "password",
		autoFocus: true,
	},
	passwordConfirmation: {
		name: "passwordConfirmation",
		label: "Password Confirmation",
		isRequired: true,
		placeholder: "Password",
		autoComplete: "password",
		autoFocus: true,
	},
	country: {
		name: "country",
		label: "Country",
		isRequired: true,
		inputType: "Select",
		array: [
			{
				_id: "US",
				name: "US",
			},
			{
				_id: "BR",
				name: "BR",
			},
		],
	},
};

export const useCreateAccountFormHook = (
	email: string,
	country: "BR" | "US" = "US",
) => {
	// Todo: we could try to guess the country by:
	// 01. using localization from router
	// 02. accessing navigator location
	const { control, handleSubmit, formState, setValue } = useForm({
		resolver: zodResolver(createAccountSchema),
		defaultValues: {
			name: email as string,
			email: email as string,
			password: "",
			passwordConfirmation: "",
			country,
		},
	});

	return {
		control,
		handleSubmit,
		formState,
		setValue,
	};
};
