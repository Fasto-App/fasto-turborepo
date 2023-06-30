import React from "react"
import { Center, Box, Heading, VStack, HStack, Button, AlertDialog, Image } from "native-base";
import { businessRoute } from "../../routes";
import { ControlledForm } from "../../components/ControlledForm";
import { ForgotPasswordConfig, useForgotPasswordHook } from "./hooks";
import { forgotPasswordSchemaInput } from "app-helpers";
import { useRecoverPasswordMutation } from "../../gen/generated";
import { Link } from "../../components/atoms/Link";
import { useTranslation } from 'next-i18next';

export const ForgotPasswordForm = () => {

  const {
    control,
    formState,
    handleSubmit,
    reset,
  } = useForgotPasswordHook()

  const { t } = useTranslation(["businessForgotPassword", "common"]);

  const [recoverPasswordMutation, { data: response, reset: resetNetwork, loading }] = useRecoverPasswordMutation()

  const handleResetPress = (data: forgotPasswordSchemaInput) => {
    recoverPasswordMutation({
      variables: {
        input: data.email.trim().toLocaleLowerCase()
      }
    })

    reset()
  }

  const successfull = !!(response?.recoverPassword)
  const cancelRef = React.useRef(null);

  return (
    <Center w="100%" height={"100vh"}>
      <Box position={"absolute"} top={"5"} left={"5"}>
        <Image src="/images/fasto-logo.svg"
          alt="Fasto Logo"
          height={36} width={180} />
      </Box>

      <AlertDialog leastDestructiveRef={cancelRef} isOpen={!!successfull} onClose={resetNetwork}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>{t("businessForgotPassword:checkYourEmail")}</AlertDialog.Header>
          <AlertDialog.Body>
            {t("businessForgotPassword:weHaveSent")}
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button onPress={resetNetwork} ref={cancelRef} colorScheme="green">
                {t("common:close")}
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>

      <Box safeArea p="2" py="8" w="90%" maxW="600">
        <Heading size="xl" fontWeight="600" color="coolGray.800" textAlign={"center"}>
          {t("businessForgotPassword:forgotPassoword")}
        </Heading>
        <Center>
          <Heading maxWidth={"400px"} mt="2" color="coolGray.600" fontWeight="medium" size="sm" textAlign={"center"}>
            {t("businessForgotPassword:body")}
          </Heading>
        </Center>
        <VStack space={3} mt="5">
          <ControlledForm
            control={control}
            formState={formState}
            Config={ForgotPasswordConfig}
          />
          <Button isLoading={loading} mt="2" bg="primary.500" onPress={handleSubmit(handleResetPress)}>
            {t("businessForgotPassword:sendLink")}
          </Button>
          <Link href={businessRoute.login}>
            {t("common:login")}
          </Link>
          <HStack mt="6" justifyContent="center">
          </HStack>
        </VStack>
      </Box>
    </Center>
  )
}