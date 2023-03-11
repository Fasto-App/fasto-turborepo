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
import { MdOutlineFrontHand } from "react-icons/md"

type IconProps = {
  type: NavigationButtonType;
  color?: string;
  size?: number | string;
};

const Icon = ({ type, color = colors.black, size = "2em" }: IconProps) => {
  switch (type) {
    case "RaisedHand":
      return <MdOutlineFrontHand color={color} size={size} />;
    case "Home":
      return <AiOutlineHome color={color} size={size} />;
    case "Settings":
      return <AiOutlineSetting color={color} size={size} />;
    case "Money":
      return <AiOutlineDollar color={color} size={size} />;
    case "Message":
      return <AiOutlineMessage color={color} size={size} />;
    case "Contacts":
      return <AiOutlineContacts color={color} size={size} />;
    case "Clock":
      return <AiOutlineClockCircle color={color} size={size} />;
    case "Shop":
      return <AiOutlineShop color={color} size={size} />;
    case "Cart":
      return <AiOutlineShoppingCart color={color} size={size} />;
    case "Menu":
      return <AiOutlineLayout color={color} size={size} />;
    case "Search":
      return <AiOutlineSearch color={color} size={size} />;
    case "Tool":
      return <AiOutlineTool color={color} size={size} />;
    case "UserAdd":
      return <AiOutlineUserAdd color={color} size={size} />;
    case "Plus":
      return <AiOutlinePlus color={color} size={size} />;
    case "Close":
      return <AiOutlineClose color={color} size={size} />;
    case "ListStar":
      return <BsListStars color={color} size={size} />;
    case "Bag":
      return <BsBag color={color} size={size} />;
    case "Radio":
      return <BsUiRadiosGrid color={color} size={size} />;
    case "Payment":
      return <BsCreditCard2Back color={color} size={size} />;
    case "ArrowBack":
      return <IoIosArrowBack color={color} size={size} />;
    case "Logout":
      return <BiLogOutCircle color={color} size={size} />;
    case "Table":
      return <TiTabsOutline color={color} size={size} />;
    case "Fork":
      return <GiKnifeFork color={color} size={size} />;
    case "Dashboard":
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
  color = colors.black,
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
  const [isHovered, setIsHovered] = React.useState(false);
  // const selectedColor = selected || isHovered ? colors.yellow : colors.black;
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
      padding={"1"}
    >
      <Icon type={type} size={"2em"} color={color} />
      <Box w={"2"} />
      <Text
        fontSize={isRow ? "lg" : "xs"}
        textAlign={"center"}
      >
        {text}
      </Text>
    </Pressable >
  );
};

export { NavigationButton };
