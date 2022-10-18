import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { LoginForm } from './LoginForm';
import { businessRoute } from '../../routes';
import { setCookies } from '../../cookies/businessCookies';

const PostUserLoginMutation = gql`
	mutation PostUserLogin($input: loginInput!) {
		postUserLogin(input: $input) {
			name
			email
			token
		}
	}
`;

export function BusinessLogin() {
	const router = useRouter();
	const [postUserLogin, { data, loading, error }] = useMutation<LoginData>(PostUserLoginMutation);

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		defaultValues: {
			email: '',
			password: '',
		},
	});

	if (data?.postUserLogin) {
		const { name, email, token } = data.postUserLogin;

		setCookies("name", name);
		setCookies("token", token);
		setCookies("email", email);
		router.push(businessRoute.dashboard);
	}

	const onSubmit = async (formData: LoginFormFields) => {

		console.log(formData);


		try {
			await postUserLogin({
				variables: {
					input: {
						email: formData.email,
						password: formData.password,
					},
				},
			});
		} catch {
			console.log("ERROR")
		}
	};
	return <LoginForm
		control={control}
		loading={loading}
		handleSubmit={handleSubmit(onSubmit)}
		router={router}
		networkError={error}
		errors={errors}
	/>;
}

export interface LoginFormFields {
	email: string;
	password: string;
}

interface PostUserLogin {
	name: string;
	email: string;
	token: string;
}

interface LoginData {
	postUserLogin: PostUserLogin;
}
