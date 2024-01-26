import React from "react";
import {
	AiOutlineHome,
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
	AiFillStar,
	AiOutlineStar,
} from "react-icons/ai";
import { NavigationButtonType } from "../types";
import { colors } from "../../theme/colors";
import {
	BsCreditCard2Back,
	BsListStars,
	BsUiRadiosGrid,
	BsPeopleFill,
	BsBag,
	BsTrash,
	BsCalendarDate,
} from "react-icons/bs";
import { IoIosArrowBack, IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { TiTabsOutline } from "react-icons/ti";
import { GiKnifeFork } from "react-icons/gi";
import { RiDashboard3Line, RiUserSettingsLine } from "react-icons/ri";
import { BiLogOutCircle } from "react-icons/bi";
import {
	MdOutlineFrontHand,
	MdOutlinePhoneIphone,
	MdLocationPin,
} from "react-icons/md";
import { ImQrcode } from "react-icons/im";
import { HiOutlineClipboardList } from "react-icons/hi";
import { Badge, Box, Pressable, Text } from "native-base";

type IconProps = {
	type: NavigationButtonType;
	color?: string;
	size?: number | string;
};

export const Icon = ({
	type,
	color = colors.black,
	size = "2em",
}: IconProps) => {
	switch (type) {
		case "Calendar":
			return <BsCalendarDate color={color} size={size} />;
		case "Location":
			return <MdLocationPin color={color} size={size} />;
		case "ArrowUp":
			return <IoIosArrowUp color={color} size={size} />;
		case "ArrowDown":
			return <IoIosArrowDown color={color} size={size} />;
		case "ClipBoard":
			return <HiOutlineClipboardList color={color} size={size} />;
		case "StarFill":
			return <AiFillStar color={color} size={size} />;
		case "StarOutline":
			return <AiOutlineStar color={color} size={size} />;
		case "Phone":
			return <MdOutlinePhoneIphone color={color} size={size} />;
		case "People":
			return <BsPeopleFill color={color} size={size} />;
		case "QRCode":
			return <ImQrcode color={color} size={size} />;
		case "TrashCan":
			return <BsTrash color={color} size={size} />;
		case "RaisedHand":
			return <MdOutlineFrontHand color={color} size={size} />;
		case "Home":
			return <AiOutlineHome color={color} size={size} />;
		case "Settings":
			return <RiUserSettingsLine color={color} size={size} />;
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
	selected,
	text,
	onPress,
	color,
	flexDirection = "column",
	numNotifications,
	disabled = false,
}: {
	type: NavigationButtonType;
	selected?: boolean;
	hovered?: boolean;
	onPress: () => void;
	color?: string;
	text?: string;
	flexDirection?: "row" | "column";
	numNotifications?: number;
	disabled?: boolean;
}) => {
	const isRow = flexDirection === "row";
	const colorSelected = color ? color : selected ? colors.orange : colors.white;

	return (
		<Pressable
			isDisabled={disabled}
			_disabled={{ opacity: 0.3 }}
			onPress={onPress}
			flexDirection={flexDirection}
			width={isRow ? "90%" : "auto"}
			background={selected ? "secondary.300" : "clear"}
			borderRadius={"md"}
			padding={"2"}
		>
			{numNotifications ? (
				<Badge
					position={"absolute"}
					backgroundColor={"black"}
					rounded="full"
					mr={-3}
					zIndex={1}
					variant="solid"
					alignSelf="flex-end"
					_text={{
						fontSize: 12,
					}}
				>
					{numNotifications}
				</Badge>
			) : null}
			<Icon type={type} size={"2em"} color={colorSelected} />
			<Box w={"2"} />
			<Text
				fontSize={isRow ? "lg" : "xs"}
				textAlign={"center"}
				color={colorSelected}
			>
				{text}
			</Text>
		</Pressable>
	);
};

const BusinessNavigationButton = ({
	type,
	selected = false,
	text,
	onPress,
	color = colors.black,
}: {
	type: NavigationButtonType;
	selected?: boolean;
	hovered?: boolean;
	onPress: () => void;
	color?: string;
	text?: string;
}) => {
	const [isHovered, setIsHovered] = React.useState(false);
	const selectedColor = selected || isHovered ? colors.orange : color;

	return (
		<Pressable
			onPress={onPress}
			onHoverIn={() => setIsHovered(true)}
			onHoverOut={() => setIsHovered(false)}
			flexDirection={"row"}
			width={"90%"}
			borderRadius={"md"}
			borderWidth={1}
			borderColor={selected ? colors.orange : "transparent"}
			padding={"2"}
		>
			<Icon type={type} size={"2em"} color={selectedColor} />
			<Box w={"2"} />
			<Text
				fontSize={"lg"}
				textAlign={"center"}
				color={selectedColor}
				alignSelf={"flex-end"}
			>
				{text}
			</Text>
		</Pressable>
	);
};

export { NavigationButton, BusinessNavigationButton };
