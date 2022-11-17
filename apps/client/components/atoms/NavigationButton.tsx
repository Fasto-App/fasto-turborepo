import React from "react";
import {
  AiOutlineHome,
  AiOutlineSetting,
  AiOutlineDollar,
  AiOutlineMessage,
  AiOutlineContacts,
  AiOutlineClockCircle,
  AiOutlineShop,
  AiOutlineShoppingCart,
  AiOutlineLayout,
  AiOutlineSearch,
  AiOutlineTool,
  AiOutlineUserAdd,
  AiOutlinePlus,
  AiOutlineClose,
} from "react-icons/ai";
import { NavigationButtonType } from "../types";
import { colors } from "../../theme/colors";
import { BsBag, BsCreditCard2Back, BsListStars, BsUiRadiosGrid } from "react-icons/bs";
import { Box, Pressable, Text, useBreakpointValue } from "native-base";
import { IoIosArrowBack } from "react-icons/io";
import { TiTabsOutline } from "react-icons/ti"
import { GiKnifeFork } from "react-icons/gi"
import { RiDashboard3Line } from "react-icons/ri"
import { BiLogOutCircle } from "react-icons/bi"
type IconProps = {
  type: NavigationButtonType;
  color?: string;
  size?: number | string;
};

const Icon = ({ type, color = colors.black, size = "2em" }: IconProps) => {
  switch (type) {
    case NavigationButtonType.Home:
      return <AiOutlineHome color={color} size={size} />;
    case NavigationButtonType.Settings:
      return <AiOutlineSetting color={color} size={size} />;
    case NavigationButtonType.Money:
      return <AiOutlineDollar color={color} size={size} />;
    case NavigationButtonType.Message:
      return <AiOutlineMessage color={color} size={size} />;
    case NavigationButtonType.Contacts:
      return <AiOutlineContacts color={color} size={size} />;
    case NavigationButtonType.Clock:
      return <AiOutlineClockCircle color={color} size={size} />;
    case NavigationButtonType.Shop:
      return <AiOutlineShop color={color} size={size} />;
    case NavigationButtonType.Cart:
      return <AiOutlineShoppingCart color={color} size={size} />;
    case NavigationButtonType.Menu:
      return <AiOutlineLayout color={color} size={size} />;
    case NavigationButtonType.Search:
      return <AiOutlineSearch color={color} size={size} />;
    case NavigationButtonType.Tool:
      return <AiOutlineTool color={color} size={size} />;
    case NavigationButtonType.UserAdd:
      return <AiOutlineUserAdd color={color} size={size} />;
    case NavigationButtonType.Plus:
      return <AiOutlinePlus color={color} size={size} />;
    case NavigationButtonType.Close:
      return <AiOutlineClose color={color} size={size} />;
    case NavigationButtonType.ListStar:
      return <BsListStars color={color} size={size} />;
    case NavigationButtonType.Bag:
      return <BsBag color={color} size={size} />;
    case NavigationButtonType.Radio:
      return <BsUiRadiosGrid color={color} size={size} />;
    case NavigationButtonType.Payment:
      return <BsCreditCard2Back color={color} size={size} />;
    case NavigationButtonType.ArrowBack:
      return <IoIosArrowBack color={color} size={size} />;
    case NavigationButtonType.Logout:
      return <BiLogOutCircle color={color} size={size} />;
    case NavigationButtonType.Table:
      return <TiTabsOutline color={color} size={size} />;
    case NavigationButtonType.Fork:
      return <GiKnifeFork color={color} size={size} />;
    case NavigationButtonType.Dashboard:
      return <RiDashboard3Line color={color} size={size} />;
    default:
      console.error("NavigationButton: Unknown type");
      return null;
  }
};

const NavigationButton = ({
  type,
  selected = false,
  text,
  onPress,
  color = colors.white,
  flexDirection = "column",
}: {
  type: NavigationButtonType;
  selected?: boolean;
  hovered?: boolean;
  onPress: () => void;
  color?: string;
  text?: string;
  flexDirection?: "row" | "column";
}) => {
  const iconSize = useBreakpointValue({
    base: "20px",
    lg: "30px",
  });
  const [isHovered, setIsHovered] = React.useState(false);
  const selectedColor = selected || isHovered ? colors.yellow : colors.pureWhite;
  const isRow = flexDirection === "row";

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      flexDirection={flexDirection}
      width={isRow ? "90%" : "auto"}
      background={selected ? "secondary.300" : "clear"}
      borderRadius={"md"}
      padding={"2"}
    >
      <Box justifyContent="center" alignItems="center" h={iconSize} w={iconSize}>
        <Icon type={type} size={"100%"} />
      </Box>
      <Box w={"2"} />
      <Text
        fontSize={isRow ? "lg" : "xs"}
      >
        {text}
      </Text>
    </Pressable >
  );
};

export { NavigationButton };
