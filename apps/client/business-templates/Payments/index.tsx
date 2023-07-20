import React from "react"
import { Box, Button, Text } from "native-base"
import { BusinessType, IsoCountry, useConnectExpressPaymentMutation } from "../../gen/generated"
import { showToast } from "../../components/showToast"

export const PaymentsScreen = () => {

  const [connectExpressPayment, { loading }] = useConnectExpressPaymentMutation({
    onCompleted: (data) => {
      console.log(data)
      window.location.assign(data.connectExpressPayment)
    },
    onError: (error) => {

      console.log(error)

      showToast({
        status: "error",
        message: error.message
      })
    }
  })

  return (
    <Box>
      <Text>Payments</Text>

      <Button onPress={() => connectExpressPayment({
        variables: {
          input: {
            business_type: BusinessType.Company,
            country: IsoCountry.Us,
          }
        }
      })}
        isLoading={loading}
      >
        Connect Express Payment
      </Button>
    </Box>
  )
}