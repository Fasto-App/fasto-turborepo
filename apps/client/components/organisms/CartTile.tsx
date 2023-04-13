import React, { useCallback } from "react";
import { Box, HStack, Image, Pressable, Text, } from "native-base";
import { IncrementButtons } from "../OrderSummary/IncrementButtons";
import debounce from 'lodash/debounce';
import { useUpdateItemFromCartMutation, useDeleteItemFromCartMutation, GetCartItemsPerTabDocument } from "../../gen/generated";
import { showToast } from "../showToast";
import { texts } from "./texts";

export type CartTileProps = {
  index: number;
  name: string;
  price: string;
  url: string;
  quantity: number;
  _id: string;
  editable?: boolean;
  navegateTo?: () => void;
};

const refetchQueries = [{
  query: GetCartItemsPerTabDocument,
}]

export const CartTile = (props: CartTileProps) => {
  const { name, index, price, quantity, url, _id, editable, navegateTo } = props;
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
      flex={1}
    >
      <Pressable onPress={navegateTo}>
        <HStack space={2}>
          <Box>
            <Image
              size={"xs"}
              source={{ uri: url }}
              alt={""}
              borderRadius={5}
            />
          </Box>
          <Text alignSelf={"center"} w={70}>{name}</Text>
        </HStack>
      </Pressable>
      <Text>{price}</Text>
      <HStack space={4}>
        <IncrementButtons
          quantity={localQuantity}
          onPlusPress={() => handleQuantityChange(localQuantity + 1)}
          onMinusPress={() => handleQuantityChange(localQuantity - 1)}
          disabled={!editable || loadingUpdate || deleteLoading}
        />
        <Pressable
          isDisabled={!editable || deleteLoading || loadingUpdate}
          _disabled={{ opacity: 0.5, }}
          backgroundColor={"tertiary.300"}
          borderRadius={"md"}
          onPress={handleDeleteItem}
          p={2}
        >
          <Text fontSize={"18"}>
            🗑
          </Text>
        </Pressable>
      </HStack>
    </HStack>

  );
};
