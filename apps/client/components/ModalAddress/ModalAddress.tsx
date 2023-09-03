import React, { useMemo } from "react";
import { debounce } from "lodash";
import { Heading, FormControl, Input, Box, Spinner, HStack, Pressable, Button, Text, Divider } from "native-base";
import { useState, useCallback } from "react";
import { useTranslation } from "next-i18next";
import { useGetGoogleAutocompleteLazyQuery, useCreateCustomerAddressMutation, TakeoutDelivery, useUpdateCustomerUpdateTabTypeMutation, useUpdateTypeAndAddressMutation, GetClientSessionDocument } from "../../gen/generated";
import { CustomModal } from "../CustomModal/CustomModal";
import { showToast } from "../showToast";
import { Icon } from "../../components/atoms/NavigationButton";
import { typedKeys } from "app-helpers";

type ModalAddressProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedType?: TakeoutDelivery | null;
  address?: any;
  screenName?: "ProductDescription" | "MenuScreen";
  setIsModalOpen?: boolean;
  tabId: string;
}
export const ModalAddress = ({
  isOpen,
  setIsOpen,
  selectedType,
  address,
  screenName,
  tabId
}: ModalAddressProps) => {
  const { t } = useTranslation("customerProductDescription")

  const [updateTabTypeAndAddress, { loading: loadingTypeAndAddress }] = useUpdateTypeAndAddressMutation({
    refetchQueries: [{ query: GetClientSessionDocument }],
  })

  const [updateTabType, { loading: loadingType }] = useUpdateCustomerUpdateTabTypeMutation({
    refetchQueries: [{ query: GetClientSessionDocument }],
  })

  const [getAutocomplete, { data, loading }] = useGetGoogleAutocompleteLazyQuery()

  const [createCustomerAddress, { loading: loadingCreateAddress }] = useCreateCustomerAddressMutation({
    refetchQueries: [{ query: GetClientSessionDocument }],
    onCompleted() {
      showToast({
        message: "Success"
      })
    },
    onError() {
      showToast({
        message: "Error",
        status: "error"
      })
    },
  })

  const [selectedAddress, setSelectedAddress] = useState<{ place_id: string; description: string }>()
  const [disregardSavedAddress, setDisregardSavedAddress] = useState(false)

  const [inputAddress, setinputAddress] = useState("")
  const [complement, setComplement] = useState("")

  const [orderUpdate, setOrderUpdate] = useState<TakeoutDelivery>()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onAddressValidation = useCallback(debounce(async (text: string) => {

    if (text.length < 4) return

    getAutocomplete({
      variables: {
        input: {
          text
        }
      }
    })
  }, 1000), [])

  const userAddress = useMemo(() => {
    if (!address?.streetAddress || disregardSavedAddress) return undefined;

    const { streetAddress, city, stateOrProvince, complement, country, postalCode } = address

    return `${streetAddress}, ${complement} - ${city} - ${stateOrProvince}, ${country}`

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address?.streetAddress, disregardSavedAddress])

  const onModalClose = useCallback(() => {
    setIsOpen(false)
    setDisregardSavedAddress(false)
    setOrderUpdate(undefined)
    setSelectedAddress(undefined)
  }, [setIsOpen])

  const onUpdate = () => {
    if (!orderUpdate && selectedAddress) {
      // if there's an address and we are not changing the type
      createCustomerAddress({
        variables: {
          input: {
            streetAddress: selectedAddress.description,
            complement: complement
          }
        }
      })

      return onModalClose()
    }

    if (orderUpdate && !selectedAddress || orderUpdate === TakeoutDelivery["Takeout"]) {
      // if there's an address, but we are changing to takeout, update only the type
      updateTabType({
        variables: {
          input: {
            type: orderUpdate,
            tab: tabId
          }
        }
      })

      return onModalClose()
    };

    // if there's an address and we are going from Takeout to Delivery, update both
    if (orderUpdate && selectedAddress && orderUpdate !== selectedType) {
      updateTabTypeAndAddress({
        variables: {
          input: {
            type: orderUpdate,
            tab: tabId
          },
          createCustomerAddressInput2: {
            streetAddress: selectedAddress.description,
            complement: complement
          }
        },
      })

      return onModalClose()
    }
  }


  const inputAddressDisabled = useMemo(() => {
    return orderUpdate === TakeoutDelivery["Takeout"] || (!orderUpdate && selectedType === TakeoutDelivery["Takeout"])
  }, [orderUpdate, selectedType])


  const shouldUpdateBeEnabled = useMemo(() => {
    return (orderUpdate === TakeoutDelivery["Delivery"] && (selectedAddress || userAddress) ||
      (!orderUpdate && selectedType === TakeoutDelivery["Delivery"]) && selectedAddress) ||
      orderUpdate !== selectedType

  }, [orderUpdate, selectedAddress, selectedType, userAddress])

  console.log({ shouldUpdateBeEnabled })
  console.log(orderUpdate, selectedType, selectedAddress, userAddress)

  const onClear = () => {
    setDisregardSavedAddress(true)
    setSelectedAddress(undefined)
    setinputAddress("")
  }


  console.log({
    selectedAddress, userAddress
  })

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onModalClose}
      HeaderComponent={
        <>
          {screenName === "ProductDescription" ?
            <Heading size={"lg"}>Does this business deliver to you?</Heading> :
            <Heading
              size={"lg"}
              textAlign={"center"}>Update Order</Heading>
          }
        </>
      }
      size={"lg"}
      ModalBody={
        <>
          {selectedType && screenName === "MenuScreen" ? (
            <HeaderTab
              selectedType={orderUpdate || selectedType}
              onHeaderPress={setOrderUpdate}
            />) :
            null}
          {!selectedAddress && !userAddress ?
            <>
              <FormControl paddingX={"4"} pt={"4"}>
                <FormControl.Label>Delivery Address</FormControl.Label>
                <Input
                  isDisabled={inputAddressDisabled}
                  mb={2}
                  value={inputAddress}
                  size={"lg"}
                  fontSize={"lg"}
                  placeholder="e.g 555 Main St, New York NY 10021"
                  onChangeText={setinputAddress}
                  // @ts-ignore
                  onChange={(e) => onAddressValidation(e.target.value)}
                  InputLeftElement={
                    <Box w={"8"} p={4}>
                      {loading ? <Spinner size="sm" /> : <Icon type="Location" size={"1.2em"} />}
                    </Box>}
                  InputRightElement={
                    <Button
                      isDisabled={inputAddressDisabled}
                      variant={"ghost"}
                      onPress={onClear}
                    >
                      Clear
                    </Button>
                  }
                />
              </FormControl>
              {inputAddress.length >= 4 && data ? data?.getGoogleAutoComplete.map(local => (
                <Pressable key={local.place_id} _hover={{ backgroundColor: "gray.100" }}
                  onPress={() => {
                    setSelectedAddress({
                      description: local.description,
                      place_id: local.place_id
                    })
                  }}>
                  <HStack alignItems={"center"} p={2} space={2} >
                    <Icon type="Location" size={"1.2em"} />
                    <Text fontSize={"lg"} >
                      {local.description}
                    </Text>
                  </HStack>
                </Pressable>)) : null}

            </>
            : <>
              <HStack flex={1} space={2} paddingY={4} alignItems={"center"}>
                <Icon type="Location" size={"1.2em"} />
                <Text
                  flex={1}
                  fontSize={"lg"}
                  color={inputAddressDisabled ? "gray.400" : undefined}
                >
                  {selectedAddress?.description || userAddress}
                </Text>
                <Button
                  size="lg" variant={"ghost"}
                  isDisabled={inputAddressDisabled}
                  onPress={onClear}>{"Clear 2"}</Button>
              </HStack>
              {selectedAddress ? <FormControl pl={"2"}>
                <FormControl.Label>Apt, suite, floor (optional)</FormControl.Label>
                <Input
                  isDisabled={inputAddressDisabled}
                  onChangeText={setComplement}
                  value={complement}
                  size={"lg"}
                  placeholder="e.g. 4S" />
              </FormControl> : null}
            </>
          }
        </>
      }
      ModalFooter={
        <>
          <Button
            _text={{ fontSize: "lg" }}
            isDisabled={!shouldUpdateBeEnabled}
            isLoading={loadingCreateAddress || loading || loadingType || loadingTypeAndAddress}
            onPress={onUpdate}
            flex={1}>
            Update
          </Button>
          <Button
            isLoading={loadingCreateAddress || loading || loadingType || loadingTypeAndAddress}
            _text={{ fontSize: "lg" }}
            flex={1}
            colorScheme={"tertiary"}
            onPress={onModalClose}
          >
            Cancel
          </Button>
        </>
      }
    />
  )
}



const HeaderTab = ({ selectedType, onHeaderPress }: {
  selectedType: TakeoutDelivery,
  onHeaderPress: (type: TakeoutDelivery) => void;
}) => {
  // if the user select something, lets save so we can send to the DB

  return <Box paddingX={"4"}>
    <HStack justifyContent={"space-around"}>
      {typedKeys(TakeoutDelivery).map(type => (
        <Pressable flex={1} key={type} onPress={() => onHeaderPress(TakeoutDelivery[type])}>
          <Heading
            size={"md"}
            textAlign={"center"}
            pb={2}
            color={selectedType === TakeoutDelivery[type] ?
              "primary.500" :
              "gray.400"}
          >
            {TakeoutDelivery[type]}
          </Heading>
        </Pressable>
      ))}
    </HStack>
    <Divider bg={"gray.300"} />
    <Box h={"2"} />
  </Box>
}