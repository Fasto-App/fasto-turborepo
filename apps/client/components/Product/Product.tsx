import React from "react";
import {
  Box,
  AspectRatio,
  Stack,
  Heading,
  HStack,
  Button,
  Text,
  Image,
  Avatar,
  VStack,
  Checkbox,
  Badge,
} from "native-base";
import { BorderTile } from "../BorderTile";
import { useTranslation } from "next-i18next";
import { MINIMUM_ITEMS_QUANTITY } from "app-helpers";
import { Icon } from "../atoms/NavigationButton";

type ProductTileProps = {
  _id?: string;
  onPress?: () => void;
  ctaTitle: string;
  name: string;
  imageUrl?: string;
  description?: string | null;
  quantity?: number | null;
  hideButton?: boolean;
  paused?: boolean | null;
};

type ProductCardProps = ProductTileProps & {
  description?: string;
  price: string;
};

type ProductTileWithCheckboxProps = ProductTileProps & {
  isChecked: boolean;
  onCheck: (selected: boolean) => void;
};

const maxLength = 120;

const IMAGE_PLACEHOLDER =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJtmXoCwCBNSm0w3SLD1aWW9m6kpRUoCFp2qmT7i5TTKE_KMRIfZUNReWEyJ6QWtx3Iww&usqp=CAU";

const ProductCard = ({
  name,
  price,
  imageUrl,
  description,
  onPress,
  quantity,
  paused
}: ProductCardProps) => {
  const { t } = useTranslation("common");

  const formattedDescriptions =
    description && description.length > maxLength
      ? description.substring(0, maxLength) + "..."
      : description;

  return (
    <Box
      w={"64"}
      maxH={"80"}
      rounded="lg"
      overflow="hidden"
      borderWidth={0.5}
      borderColor="coolGray.300"
      backgroundColor="white"
      shadow="4"
      mr={"4"}
      mb={"4"}
      opacity={paused ? 0.6 : 1}
    >
      <Box alignItems="center" backgroundColor={"secondary.300"} >
        {paused ? <Box
          position={"absolute"}
          alignItems={"flex-end"} w={"100%"}>
          <Icon type="Paused" color="red" />
        </Box> : null}
        <AspectRatio w="60%" ratio={16 / 9} top={5}>
          <Image
            source={{
              uri: imageUrl ? imageUrl : IMAGE_PLACEHOLDER,
            }}
            alt="image"
            borderRadius={"sm"}
          />
        </AspectRatio>
      </Box>
      <Stack pt={8} p={2} space={2} flex={1}>
        <Heading size="md" textAlign={"center"}>
          {name}
        </Heading>
        <Text fontSize={"xs"} fontWeight={"500"} textAlign={"center"}>
          {quantity ? (
            quantity <= MINIMUM_ITEMS_QUANTITY ? (
              <Badge colorScheme={"error"} variant={"solid"}>{`${t(
                "lowStock"
              )}: ${quantity}`}</Badge>
            ) : (
              <Badge colorScheme={"success"} variant={"outline"}>{`${t(
                "inStock"
              )}: ${quantity}`}</Badge>
            )
          ) : (
            <Badge colorScheme={"orange"} variant={"solid"}>{`${t(
              "noStock"
            )}`}</Badge>
          )}
        </Text>
        <Text fontWeight="400" textAlign={"center"} flex={1}>
          {formattedDescriptions}
        </Text>
        <HStack alignItems="center" space={2} justifyContent="center">
          <Text fontWeight="400" fontSize={"lg"} mx={"4"}>
            {price}
          </Text>
          {onPress ? (
            <Button w={"100"} colorScheme="tertiary" onPress={onPress}>
              {t("edit")}
            </Button>
          ) : null}
        </HStack>
      </Stack>
    </Box>
  );
};

// create a new component that accepts the same props as ProductTile
const ProductTile = ({
  name,
  imageUrl,
  onPress,
  ctaTitle,
  description,
  quantity,
  hideButton,
}: ProductTileProps) => {
  const { t } = useTranslation("common");

  const formattedDescriptions =
    description && description.length > maxLength
      ? description.substring(0, maxLength) + "..."
      : description;
  return (
    <BorderTile width={"96"}>
      <HStack alignItems="center" space={3} flex={1}>
        <Avatar
          backgroundColor={"white"}
          size="48px"
          source={{
            uri: imageUrl ? imageUrl : IMAGE_PLACEHOLDER,
          }}
        />
        <VStack flex={1} h={"100%"} justifyContent={"space-between"}>
          <Text color="coolGray.800" bold>
            {name}
          </Text>
          <Text fontSize={"xs"} fontWeight={"500"} textAlign={"left"}>
            {quantity ? (
              quantity <= MINIMUM_ITEMS_QUANTITY ? (
                <Badge colorScheme={"error"} variant={"solid"}>{`${t(
                  "lowStock"
                )}: ${quantity}`}</Badge>
              ) : (
                <Badge colorScheme={"success"} variant={"outline"}>{`${t(
                  "inStock"
                )}: ${quantity}`}</Badge>
              )
            ) : (
              <Badge colorScheme={"orange"} variant={"solid"}>{`${t(
                "noStock"
              )}`}</Badge>
            )}
          </Text>
          {formattedDescriptions ? (
            <Text color="coolGray.600" fontSize={"xs"}>
              {formattedDescriptions}
            </Text>
          ) : null}
        </VStack>
        <HStack
          alignItems="center"
          space={2}
          justifyContent="space-between"
          py={4}
        >
          <Button
            w={"100"}
            colorScheme="tertiary"
            onPress={onPress}
            isDisabled={hideButton || (!!quantity && quantity <= 0)}
          >
            {ctaTitle}
          </Button>
        </HStack>
      </HStack>
    </BorderTile>
  );
};

const ProductTileWithCheckbox = ({
  name,
  imageUrl,
  description,
  _id,
  isChecked,
  onCheck,
  quantity,
}: ProductTileWithCheckboxProps) => {
  const { t } = useTranslation("common");

  const formattedDescriptions =
    description && description.length > maxLength
      ? description.substring(0, maxLength) + "..."
      : description;

  return (
    <BorderTile width={"96"}>
      <HStack alignItems="center" space={3} flex={1}>
        <Avatar
          size="48px"
          source={{ uri: imageUrl ? imageUrl : IMAGE_PLACEHOLDER }}
        />

        <VStack flex={1} h={"100%"} justifyContent={"space-between"}>
          <Text color="coolGray.800" bold>
            {typeof quantity === "number" ? `${name} (${quantity})` : name}
          </Text>
          {formattedDescriptions ? (
            <Text color="coolGray.600" fontSize={"xs"}>
              {formattedDescriptions}
            </Text>
          ) : null}
          <Box flex={1} justifyContent={"flex-end"} pt={2}>
            <Checkbox
              alignContent={"flex-end"}
              value={_id ?? name}
              my="1"
              isChecked={isChecked}
              onChange={onCheck}
            >
              {t("addToMenu")}
            </Checkbox>
          </Box>
        </VStack>
      </HStack>
    </BorderTile>
  );
};

export { ProductCard, ProductTile, ProductTileWithCheckbox };
