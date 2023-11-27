import React from 'react'
import { CustomModal } from '../../components/CustomModal/CustomModal'
import { Badge, Box, Button, FlatList, Text, VStack } from 'native-base'
import router, { useRouter } from 'next/router'
import { useGetOrdersByCheckoutQuery } from '../../gen/generated'
import { LoadingCartItems } from '../../customer-templates/CartScreen/LoadingTiles'
import { PastOrdersTile } from '../../customer-templates/CartScreen/PastOrdersModal'
import { PRODUCT_PLACEHOLDER_IMAGE, parseToCurrency } from 'app-helpers'
import { format } from 'date-fns'
import { getLocale } from '../../authUtilities/utils'
import { businessRoute } from 'fasto-route'
import { useTranslation } from 'next-i18next'

type OrdersModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  checkoutId: string;
}

export const OrdersModal = ({ isOpen, setIsOpen, checkoutId }: OrdersModalProps) => {
  const { t } = useTranslation("businessOrders")

  const { data, loading, error } = useGetOrdersByCheckoutQuery({
    skip: !checkoutId,
    variables: {
      input: {
        _id: checkoutId
      }
    }
  })

  return (
    <CustomModal
      size={"xl"}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      HeaderComponent={<VStack space={"2"} pb={"4"}>
        <Text fontSize={"lg"}>
          {`${t("status")}: `}
          <Badge variant={"subtle"}
            colorScheme={data?.getOrdersByCheckout.status === "Paid" ? "success" : "yellow"}>
            {data && t(data.getOrdersByCheckout.status)}</Badge>
        </Text>

        <Text fontSize={"lg"}>
          {`${t("date")}: ${format(Number(data?.getOrdersByCheckout.created_date || 0),
            "PPpp", getLocale(router.locale))}`}
        </Text>
      </VStack>}
      ModalBody={<>
        {loading ? <LoadingCartItems /> : error ? <Text>Error</Text> :
          <FlatList
            data={data?.getOrdersByCheckout.orders}
            renderItem={({ item, index }) => !!item ?
              <PastOrdersTile
                index={index}
                name={item.product.name}
                url={item.product.imageUrl || PRODUCT_PLACEHOLDER_IMAGE}
                price={parseToCurrency(item.subTotal)}
                quantity={item.quantity}
                orderStatus={item.status}
                _id={item._id}

              /> : null}
          />}
      </>}
      ModalFooter={<Button.Group space={2} flex={1} >
        <Button
          onPress={() => setIsOpen(false)}
          flex={1} colorScheme={"tertiary"}>
          {t("close")}
        </Button>
        <>
          {data?.getOrdersByCheckout.paid || router.pathname === businessRoute['checkout/[checkoutId]'] ? null :
            <Button flex={1}
              onPress={() => {
                setIsOpen(false)

                router.push({
                  pathname: businessRoute['checkout/[checkoutId]'],
                  query: {
                    checkoutId: data?.getOrdersByCheckout._id,
                    tabId: data?.getOrdersByCheckout.tab
                  }
                })
              }
              }>
              {`${t("checkout")} ${parseToCurrency(data?.getOrdersByCheckout.subTotal)}`}
            </Button>}
        </>
      </Button.Group >
      }
    />
  )
}
