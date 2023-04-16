import { Box, Button, Divider, Heading, HStack, Text, VStack } from 'native-base'
import React, { useState } from 'react'
import { FDSSelect } from '../../components/FDSSelect'
import { FDSTab, TabsType } from '../../components/FDSTab'
import { PayTable } from './PayTable'
import { Split } from './Split'
import { useRouter } from 'next/router'
import { useGetCheckoutByIdQuery } from '../../gen/generated'
import { showToast } from '../../components/showToast'

const tabs: TabsType = {
  payTable: "Pay Table",
  split: "Split Payment",
}

export const CheckoutScreen = () => {
  const [selectedTab, setSelectedTab] = useState("payTable");

  const router = useRouter()
  const { checkoutId } = router.query

  const { data } = useGetCheckoutByIdQuery({
    skip: !checkoutId,
    variables: {
      input: {
        _id: checkoutId as string
      }
    },
    onError: () => {
      showToast({
        message: "Error fetching checkout information",
        status: "error",
      })
    }
  })

  const pay = () => {
    console.log("pay")
  }

  return (
    <Box p={4} flex={1}>
      <Box flex={1}>
        <FDSTab
          tabs={tabs}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
        {selectedTab === "split" && <Split />}
        <PayTable
          subtotal={data?.getCheckoutByID?.subTotal || 0}
          taxes={data?.getCheckoutByID?.tax || 0}
          tip={data?.getCheckoutByID?.tip || 0}
          total={data?.getCheckoutByID?.total || 0}
        />
      </Box>
      <Box justifyContent={"flex-end"} mt={4}>
        <VStack space={"4"} p={4}>
          <Button
            _text={{ bold: true }}
            flex={1}
            colorScheme={"primary"}
            onPress={pay}>{"Pay"}</Button>
          <Button
            _text={{ bold: true }}
            flex={1}
            colorScheme={"tertiary"}
            onPress={pay}>{"See Check"}</Button>
        </VStack>
      </Box>
    </Box>
  )
}
