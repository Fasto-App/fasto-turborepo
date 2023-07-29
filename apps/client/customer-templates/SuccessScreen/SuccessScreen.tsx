import React, { useCallback, useState } from 'react'
import { SuccessAnimation } from '../../components/SuccessAnimation'
import { Box, Button, Center, HStack, Image, Text } from 'native-base'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { customerRoute } from 'fasto-route'
import { clearClientCookies } from '../../cookies'
import { PastOrdersModal } from '../CartScreen/PastOrdersModal'

export const SuccessScreen = () => {

  const { t } = useTranslation("common")
  const [isModalOpen, setIsModalOpen] = useState(false)

  const router = useRouter()

  const { businessId } = router.query

  const endSession = useCallback(() => {
    if (!businessId) throw new Error("Missing businessId")

    clearClientCookies(typeof businessId === "string" ? businessId : businessId[0])

    router.push({
      pathname: customerRoute['/customer/[businessId]'],
      query: {
        businessId
      }
    })

  }, [businessId, router])

  return (
    <>
      <PastOrdersModal setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} />
      <Box flex={1} height={"100%"}>
        <Center p={"4"} flex={1}>
          <Box pb={12}>
            <Image src="/images/fasto-logo.svg"
              alt="Fasto Logo"
              height={36} width={180} />
          </Box>
          <Box size={"24"}>
            <SuccessAnimation />
          </Box>
          {/* t("successMessage") */}
          <Text textAlign={"center"} fontSize={"lg"} mt={8}>{"Sua conta foi encerrada com sucesso.\nPor favor, dirija-se ao caixa!"}</Text>
        </Center>
        <HStack space={"4"} p={4}>
          <Button
            flex={1}
            onPress={endSession}
          >
            {t("logout")}
          </Button>
          <Button
            flex={1}
            colorScheme={"tertiary"}
            onPress={() => setIsModalOpen(true)}>
            {t("allOrders")}
          </Button>
        </HStack>
      </Box>
    </>
  )
}
