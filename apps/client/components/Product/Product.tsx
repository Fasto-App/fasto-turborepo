import { Skeleton } from "@/shadcn/components/ui/skeleton"
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
import { cn } from "@/shadcn/lib/utils";
import { PlusCircledIcon } from "@radix-ui/react-icons"

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
    >
      <Box alignItems="center" backgroundColor={paused ? "secondary.200" : "secondary.400"}>
        {paused ? <Box
          position={"absolute"}
          alignItems={"flex-end"} w={"100%"}>
          <Icon type="Paused" color="red" size={"3em"} />
        </Box> : null}
        <AspectRatio w="60%" ratio={16 / 9} top={5} opacity={paused ? 0.6 : 1}>
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
        <Heading size="md" textAlign={"center"} opacity={paused ? 0.6 : 1}>
          {name}
        </Heading>
        <Text fontSize={"xs"} fontWeight={"500"} textAlign={"center"} opacity={paused ? 0.6 : 1}>
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
        <Text fontWeight="400" textAlign={"center"} flex={1} opacity={paused ? 0.6 : 1}>
          {formattedDescriptions}
        </Text>
        <HStack alignItems="center" space={2} justifyContent="center">
          <Text fontWeight="400" fontSize={"lg"} mx={"4"} opacity={paused ? 0.6 : 1}>
            {price}
          </Text>
          {onPress ? (
            <Button _text={{ bold: true }} w={"100"} colorScheme={"tertiary"} onPress={onPress}>
              {t("edit")}
            </Button>
          ) : null}
        </HStack>
      </Stack>
    </Box>
  );
};


export function SkeletonProductTile() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-20 w-full rounded-xl" />
    </div>
  )
}

// create a new component that accepts the same props as ProductTile
const ProductTile = ({
  name,
  imageUrl,
  onPress,
  ctaTitle,
  description,
  quantity,
  hideButton,
  paused
}: ProductTileProps) => {
  const { t } = useTranslation("common");

  console.log("product changed")

  const formattedDescriptions =
    description && description.length > maxLength
      ? description.substring(0, maxLength) + "..."
      : description;
  return (
    <div
      className="w-full max-h-72 min-h-20 mb-4 flex flex-1 rounded-lg border bg-white shadow-md p-2 gap-2 hover:cursor-pointer"
      onClick={!hideButton ? onPress : undefined}
    >
      <Avatar
        backgroundColor={"white"}
        size="48px"
        opacity={paused ? 0.6 : 1}
        source={{
          uri: imageUrl ? imageUrl : IMAGE_PLACEHOLDER,
        }}
      />
      <div className={cn("flex flex-1  flex-col gap-1", paused ? "opacity-60" : "opacity-100")}>
        {paused ? <Icon type="Paused" color="red" size={"1.5em"} /> : null}

        <div className="flex justify-between">
          <Text color="coolGray.800" bold>
            {name}
          </Text>
          <PlusCircledIcon />
        </div>

        <Text fontSize={"xs"} fontWeight={"500"} textAlign={"left"}>
          {quantity ? (
            quantity <= MINIMUM_ITEMS_QUANTITY ? (
              <Badge colorScheme={"orange"} variant={"solid"}>{`${t(
                "lowStock"
              )}: ${quantity}`}</Badge>
            ) : (
              <Badge colorScheme={"success"} variant={"solid"}>{`${t(
                "inStock"
              )}: ${quantity}`}</Badge>
            )
          ) : (
            <Badge colorScheme={"error"} variant={"solid"}>{`${t(
              "noStock"
            )}`}</Badge>
          )}
        </Text>
        {formattedDescriptions ? (
          <Text color="coolGray.600" fontSize={"xs"}>
            {formattedDescriptions}
          </Text>
        ) : null}
      </div>
    </div>
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
  paused
}: ProductTileWithCheckboxProps) => {
  const { t } = useTranslation("common");

  const formattedDescriptions =
    description && description.length > maxLength
      ? description.substring(0, maxLength) + "..."
      : description;

  return (
    <BorderTile width={"96"}>
      <HStack alignItems="center" space={3} flex={1} opacity={paused ? 0.6 : 1}>
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
              isDisabled={!!paused}
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
