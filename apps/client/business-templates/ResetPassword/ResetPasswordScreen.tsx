import React from 'react'
import { Center, Box, Heading, VStack, Link, HStack, Button, Pressable, Text } from "native-base";
import NextLink from "next/link";
import { businessRoute } from '../../routes';
import { useResetPasswordHook } from './hook';
import { setCookies } from 'cookies-next';
import { useRouter } from 'next/router';
import { useUpdateUserInformationMutation } from '../../gen/generated';
import { resetPasswordSchemaInput } from 'app-helpers';

const texts = {
  resetPassword: "Reset Password",
  pleaseEnterYourPassword: (email: string) => `${email}, Please enter and confirm your new password`,
  newPassword: "New Password",
  reset: "Reset",
  passwordConfirmation: "Password Confirmation",
  passwordConfirmationError: "Password Confirmation does not match",
  passwordError: "Password must be at least 8 characters long",
  goBack: "Go Back",
}

export const ResetPasswordScreen = ({ _id, email }: {
  _id: string;
  email: string;
}) => {
  const { control, formState, reset, handleSubmit } = useResetPasswordHook()

  const isConfirmAccountValid = (passwordConfirmation: string) => control._formValues.password === passwordConfirmation;

  const [showPass, setShowPass] = React.useState(false);

  const router = useRouter();
  const [resetPassword, { data, loading, error: newtworkError }] = useUpdateUserInformationMutation({
    onCompleted: (data) => {
      console.log("Reset password completed")
      setCookies("opentab-cookies-name", data.updateUserInformation.name);
      setCookies("opentab-cookies-token", data.updateUserInformation.token);
      setCookies("opentab-cookies-email", data.updateUserInformation.email);
      router.push(businessRoute.dashboard);
    }
  });

  const onResetSubmit = (formData: resetPasswordSchemaInput) => {
    resetPassword({
      variables: {
        input: {
          _id,
          password: formData.password,
          passwordConfirmation: formData.passwordConfirmation
        }
      }
    })

    reset();
  }


  return (<Center w="100%" height={"100%"}>
    <Box safeArea p="2" py="8" w="90%" maxW="600">
      <Heading size="xl" fontWeight="600" color="coolGray.800" textAlign={"center"} _dark={{
        color: "warmGray.50"
      }}>
        {texts.resetPassword}
      </Heading>
      <Center>
        <Heading maxWidth={"400px"} mt="2" alignContent={"center"} _dark={{
          color: "warmGray.200"
        }} color="coolGray.600" fontWeight="medium" size="sm" textAlign={"center"}>
          {texts.pleaseEnterYourPassword(email)}
        </Heading>
      </Center>

      <VStack space={3} mt="5">
        {/* <FormControl>
          <FormControl.Label>New Password</FormControl.Label>
          <Controller
            name="password"
            control={control}
            rules={{ required: true, validate: (value) => validatePassword(value) }}
            render={({ field }) => {
              const { ref, ...rest } = field;
              return <Input {...rest} ref={ref} type={showPass ? "text" : "password"}
                InputRightElement={
                  <Pressable onPress={() => setShowPass(!showPass)}
                    style={{ right: 8, top: 2 }}
                  >
                    <HideAndShowIcon isHidden={showPass} color={"gray"} size={"1.5em"} />
                  </Pressable>
                } autoComplete={'password-new'} />
            }}
          />
          <FormControl.Label>Password Confirmation</FormControl.Label>
          <Controller
            name="passwordConfirmation"
            control={control}
            rules={{ required: true, validate: (value) => validatePassword(value) && isConfirmAccountValid(value) }}
            render={({ field }) => {
              const { ref, ...rest } = field;
              return <Input {...rest} ref={ref} type={showPass ? "text" : "password"}
                InputRightElement={
                  <Pressable onPress={() => setShowPass(!showPass)}
                    style={{ right: 8, top: 2 }}
                  >
                    <HideAndShowIcon isHidden={showPass} color={"gray"} size={"1.5em"} />
                  </Pressable>
                } />
            }}
          />
        </FormControl>
        {errors.password ? <Text color={"red.500"}>{"Provide a valid password. At leat 8 characters, mixing letters and numbers."}</Text> :
          errors.passwordConfirmation ? <Text color={"red.500"}>{"Make sure both passwords match."}</Text> : errors.email ? <Text color={"red.500"}>{"Provide a valid email."}</Text> : newtworkError ? <Text color={"red.500"}>{"Somethng went wrong."}</Text> : null} */}
        <Button mt="2" bg="primary.500" onPress={handleSubmit(onResetSubmit)}>
          Reset
        </Button>
        <HStack mt="6" justifyContent="center">
          <Text fontSize="sm" color="coolGray.600" _dark={{
            color: "warmGray.200"
          }}>
            I'm already a user.{" "}
          </Text>
          <Pressable>
            <NextLink href={businessRoute.login}>
              <Link _text={{
                color: "indigo.500",
                fontWeight: "medium",
                fontSize: "sm"
              }}>
                Login In
              </Link>
            </NextLink>
          </Pressable>
        </HStack>
      </VStack>
    </Box>
  </Center >)
}