import React from 'react'
import { Center, Box, Heading, VStack, FormControl, Input, Link, HStack, Button, Pressable, Text, AlertDialog, Image } from "native-base";
import NextLink from "next/link";
import { Controller } from "react-hook-form";
import { businessRoute } from 'fasto-route';
import { validateEmail } from '../../authUtilities/utils';
import { useSignUpHook } from './hooks';
import { useRequestUserAccountCreationMutation } from '../../gen/generated';
import { SignUpSchemaInput, localeObj, Locale } from 'app-helpers';
import { useTranslation } from 'next-i18next';
import { FDSSelect } from '../../components/FDSSelect';
import { useRouter } from 'next/router';

export const SignUpFormScreen = () => {
  const cancelRef = React.useRef(null);
  const { control, formState, handleSubmit, reset, } = useSignUpHook()

  const [requestAccountCreation,
    { data, loading, error, reset: resetNetwork }
  ] = useRequestUserAccountCreationMutation()

  const router = useRouter()

  const { t } = useTranslation(["common", "businessSignUp"])

  const onSignUpSubmit = async (formData: SignUpSchemaInput) => {
    await requestAccountCreation({
      variables: {
        input: {
          email: formData.email,
        }
      }
    })

    reset()
  }

  return (
    <Center w="100%" height={"100vh"}>
      <Box position={"absolute"} top={"5"} left={"5"}>
        <Image src="/images/fasto-logo.svg"
          alt="Fasto Logo"
          height={36} width={180} />
      </Box>
      <Box position={"absolute"} top={"5"} right={"5"}>
        <FDSSelect
          w="70"
          h="8"
          array={localeObj}
          selectedValue={router.locale as Locale}
          setSelectedValue={(value) => {
            const path = router.asPath;
            return router.push(path, path, { locale: value });
          }} />
      </Box>
      <AlertDialog leastDestructiveRef={cancelRef} isOpen={data?.requestUserAccountCreation?.ok} onClose={resetNetwork}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>{t("businessSignUp:checkYourEmail")}</AlertDialog.Header>
          <AlertDialog.Body>
            {t("businessSignUp:weHaveSent")}
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button w={"100"} onPress={resetNetwork} ref={cancelRef} colorScheme="green">
              {t("common:ok")}
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
      <Box safeArea p="2" py="8" w="90%" maxW="600">
        <Heading size="2xl" fontWeight="600" color="coolGray.800" textAlign={"center"} _dark={{
          color: "warmGray.50"
        }}>
          {t("common:welcomeToFasto")}
        </Heading>
        <Heading mt="2" _dark={{
          color: "warmGray.200"
        }} color="coolGray.600" fontWeight="medium" size="sm" textAlign={"center"}>
          {t("common:theSmartestAndFastestWay")}
        </Heading>

        <VStack space={3} mt="5">
          <FormControl>
            <FormControl.Label>{t("email")}</FormControl.Label>
            <Controller
              name="email"
              control={control}
              rules={{ required: true, validate: (value) => !!validateEmail(value) }}
              render={({ field }) => {
                const { ref, ...rest } = field;
                return <Input {...rest} ref={ref} />
              }}
            />
          </FormControl>
          {formState.errors.email ? <Text color={"red.500"}>{t("common:provideValidEmail")}</Text> :
            formState.errors.emailConfirmation ? <Text color={"red.500"}>{t("common:makeSureEmailsMatch")}</Text>
              : error ? <Text color={"red.500"}>{t("common:somethingWentWrong")}</Text> : null}
          <Button
            mt="2"
            bg="primary.500"
            onPress={handleSubmit(onSignUpSubmit)}
            isLoading={loading}
          >
            {t("signUp")}
          </Button>
          <HStack mt="6" justifyContent="center">
            <Text fontSize="sm" color="coolGray.600" _dark={{
              color: "warmGray.200"
            }}>
              {t("businessSignUp:iAmAnUser")}
            </Text>
            <Pressable>
              <NextLink href={businessRoute.login}>
                <Link _text={{
                  color: "indigo.500",
                  fontWeight: "medium",
                  fontSize: "sm"
                }}>
                  {t("login")}
                </Link>
              </NextLink>
            </Pressable>
          </HStack>
        </VStack>
      </Box>
    </Center >)
}