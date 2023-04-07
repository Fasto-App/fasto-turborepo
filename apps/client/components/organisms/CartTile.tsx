import React, { useCallback } from "react";
import { Box, HStack, Image, Pressable, Text } from "native-base";
import { IncrementButtons } from "../OrderSummary/IncrementButtons";
import debounce from 'lodash/debounce';
import { useUpdateItemFromCartMutation, useDeleteItemFromCartMutation, GetCartItemsPerTabDocument } from "../../gen/generated";
import { showToast } from "../showToast";

const IMAGE_PLACEHOLDER = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fGhlYWx0aHklMjBmb29kfGVufDB8fDB8fA%3D%3D&w=1000&q=80";

export type CartTileProps = {
  index: number;
  name: string;
  price: string;
  url: string;
  quantity: number;
  _id: string;
};

const states = ["✅", "⏳"];

// for both funtions we should refetch the cart
const refetchQueries = [{
  query: GetCartItemsPerTabDocument,
}]


export const CartTile = (props: CartTileProps) => {
  const { name, index, price, quantity, url, _id } = props;
  const [localQuantity, setLocalQuantity] = React.useState(quantity || 1);

  const [updateItem, { loading: loadingUpdate }] = useUpdateItemFromCartMutation({
    refetchQueries: refetchQueries,
    onCompleted: () => {
      showToast({ message: texts.itemUpdated })
    },
    onError: (err) => {
      showToast({
        message: texts.errorUpdatingItem,
        subMessage: err.message,
        status: "error"
      })
    }
  })

  const [deleteitem, { loading: deleteLoading }] = useDeleteItemFromCartMutation({
    refetchQueries: refetchQueries,
    onCompleted: () => {
      showToast({ message: texts.itemDeleted })
    },
    onError: (err) => {
      showToast({
        message: texts.errorDeletingItem,
        subMessage: err.message,
        status: "error"
      })
    }
  })


  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceditemUpdate = useCallback(debounce((qnt: number) => {
    console.log("sending patch request");

    updateItem({
      variables: {
        input: {
          quantity: qnt,
          cartItem: _id,
        }
      }
    })

  }, 1000), [])

  const handleDeleteItem = () => {

    deleteitem({
      variables: {
        input: {
          cartItem: _id,
        }
      }
    })
  }



  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;

    setLocalQuantity(newQuantity);
    debounceditemUpdate(newQuantity)
  }

  return (
    <HStack
      borderRadius={"sm"}
      p={2}
      backgroundColor={index % 2 === 0 ? "primary.100" : "white"}
      justifyContent={"space-between"}
      alignItems={"center"}
      space={6}
    >
      <HStack space={2} flex={1}>
        <Box>
          <Image
            size={"xs"}
            source={{ uri: url }}
            alt={""}
            borderRadius={5}
          />
        </Box>
        <Text alignSelf={"center"} maxW={100}>{name}</Text>
      </HStack>

      <Text>{price}</Text>
      <Box>
        <IncrementButtons
          quantity={localQuantity}
          onPlusPress={() => handleQuantityChange(localQuantity + 1)}
          onMinusPress={() => handleQuantityChange(localQuantity - 1)}
          disabled={loadingUpdate || deleteLoading}
        />
      </Box>
      <Box style={{ flexDirection: "row" }}>
        <Pressable
          isDisabled={loadingUpdate || deleteLoading}
          backgroundColor={"tertiary.300"}
          borderRadius={"md"}
          onPress={handleDeleteItem}
          p={2}
        >
          <Text fontSize={"18"}>
            🗑
          </Text>
        </Pressable>
      </Box>
    </HStack>

  );
};

export const PastOrdersTile = (props: CartTileProps) => {
  const { name, index, price, url, quantity } = props;

  return (
    <HStack
      borderRadius={"sm"}
      p={2}
      backgroundColor={index % 2 === 0 ? "primary.100" : "white"}
      justifyContent={"space-between"}
      alignItems={"center"}>
      <HStack space={2}>
        <Box>
          <Image
            size={"xs"}
            source={{ uri: url || IMAGE_PLACEHOLDER }}
            alt={""}
            borderRadius={5}
          />
        </Box>
        <Text alignSelf={"center"} maxW={200}>{name}</Text>
      </HStack>
      <Text>{`X${quantity}`}</Text>
      <Text>{price}</Text>
      <Text fontSize={"18"}>
        {index > 5 ? states[0] : states[1]}
      </Text>
    </HStack>

  );
};
