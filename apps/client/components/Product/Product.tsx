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
  Checkbox
} from "native-base";
import { BorderTile } from "../BorderTile";
import { useTranslation } from "next-i18next";
import { MINIMUM_ITEMS_QUANTITY } from "app-helpers";
import { Icon } from "../atoms/NavigationButton";
import { cn } from "@/shadcn/lib/utils";
import { PlusCircledIcon } from "@radix-ui/react-icons"
import { Card } from "@/shadcn/components/ui/card";
import { Badge } from "@/shadcn/components/ui/badge";

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
    <Card className="cursor-pointer w-36 max-h-60 sm:w-64 sm:max-h-80 rounded-lg overflow-hidden border-0.5 border-coolGray-300 bg-white shadow-md mr-4 mb-4" onClick={onPress}>
      <div className=" sm:bg-secondary-400 py-2 relative h-24">
        <div className={`flex items-center justify-center bg-${paused ? "secondary-200" : "secondary-400"}`}>
          {paused && (
            <div className="absolute top-0 right-0">
              <Icon type="Paused" color="red" size="3em" />
            </div>
          )}
          <div className="absolute top-2 sm:top-5 flex justify-center items-center" style={{ opacity: paused ? 0.6 : 1 }}>
            <div>
              <img
                src={imageUrl ? imageUrl : IMAGE_PLACEHOLDER}
                alt="image"
                className="rounded-sm w-32 sm:w-40  h-20 sm:h-24 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="pt-2 sm:pt-8 p-2 space-y-2 flex-1">
        <h3 className={`text-md text-center ${paused ? "opacity-60" : ""}`}>{name}</h3>
        <p className={`text-xs font-semibold text-center ${paused ? "opacity-60" : ""}`}>
          {quantity ? (
            quantity <= MINIMUM_ITEMS_QUANTITY ? (
              <Badge className=" bg-orange-400 text-white p-1 sm:p-2">{`${t(
                "lowStock"
              )}: ${quantity}`}</Badge>
            ) : (
              <Badge className=" border-green-800 text-green-800 p-1 sm:p-2" variant="outline">{`${t(
                "inStock"
              )}: ${quantity}`}</Badge>
            )
          ) : (
            <Badge className="bg-red-700 text-white p-1 sm:p-2" >{`${t(
              "noStock"
            )}`}</Badge>
          )}
        </p>
        <p className={`hidden sm:flex font-normal text-center flex-1 ${paused ? "opacity-60" : ""}`}>
          {formattedDescriptions}
        </p>
        <div className="flex items-center space-x-2 justify-center">
          <p className={`font-normal text-lg mx-4 ${paused ? "opacity-60" : ""}`}>{price}</p>
        </div>
      </div>
    </Card>

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
      className="xl:max-w-full xl:min-w-96 md:max-w-full md:min-w-64 sm:max-w-full sm:min-w-72 max-w-full min-w-64 max-h-72 min-h-20 mb-4 mx-2 flex flex-1 rounded-lg border bg-white shadow-md p-2 gap-2 hover:cursor-pointer"
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
      <div className={`flex justify-start items-start flex-col gap-1", ${paused ? "opacity-60" : "opacity-100"}`}>
        {paused ? <Icon type="Paused" color="red" size={"1.5em"} /> : null}

        <div className="flex justify-between">
          <p className="text-gray-800 font-bold pb-1">
            {name}
          </p>
        </div>

        <p className={`text-xs pb-1 text-center ${paused ? "opacity-60" : ""}`}>
          {quantity ? (
            quantity <= MINIMUM_ITEMS_QUANTITY ? (
              <Badge className=" bg-orange-400 text-white">{`${t(
                "lowStock"
              )}: ${quantity}`}</Badge>
            ) : (
              <Badge className=" border-green-800 text-green-800" variant="outline">{`${t(
                "inStock"
              )}: ${quantity}`}</Badge>
            )
          ) : (
            <Badge className="bg-red-700 text-white" >{`${t(
              "noStock"
            )}`}</Badge>
          )}
        </p>
        {formattedDescriptions ? (
          <p className="hidden sm:flex text-gray-600 text-xs">
            {formattedDescriptions}
          </p>
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
