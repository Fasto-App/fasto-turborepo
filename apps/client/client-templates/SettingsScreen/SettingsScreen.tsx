import React, { FC, useCallback } from "react";
import { Avatar, Badge, Box, Center, ChevronRightIcon, HStack, Text, VStack, Pressable } from "native-base";
import { DICE_BEAR_INITIALS_URL } from "app-helpers";
import { Icon } from "../../components/atoms/NavigationButton";
import { NavigationButtonType } from "../../components/types";
import { ILinearGradientProps } from "native-base/lib/typescript/components/primitives/Box/types";
import { ResponsiveValue, ColorType } from "native-base/lib/typescript/components/types";
import { useGetClientInformation, useGetTabInformation } from "../../hooks";
import { CustomModal } from "../../components/CustomModal/CustomModal";
import QRCode from "react-qr-code";
import { clientRoute } from "../../routes";
import { useRouter } from "next/router";

const ListBorderTile: React.FC = ({ children }) => {
  return (
    <HStack
      w={"100%"}
      p={2}
      borderRadius={"md"}
      justifyContent={"space-between"}
      alignItems={"center"}
      backgroundColor={"white"}
    >
      {children}
    </HStack>
  );
};

type SettingsTileProps = {
  _id: string;
  icon: NavigationButtonType;
  iconBackgroundColor: ResponsiveValue<ColorType | ILinearGradientProps>;
  title: string;
  onPress?: () => void;
  disabled?: boolean;
}

const settingsTiles: SettingsTileProps[] = [
  {
    _id: "qrcode",
    icon: "QRCode",
    title: "Share QR Code",
    iconBackgroundColor: "blueGray.500"
  },
  {
    _id: "message",
    icon: "Message",
    title: "Message Staff",
    iconBackgroundColor: "amber.500"
  },
  {
    _id: "contacts",
    icon: "Contacts",
    title: "Invite User",
    iconBackgroundColor: "indigo.500"
  },
  {
    _id: "settings",
    icon: "Settings",
    title: "Message Staff",
    iconBackgroundColor: "emerald.500"
  }
]

const SettingsTile: FC<SettingsTileProps> = ({ icon, title, iconBackgroundColor, onPress, disabled }) => {
  return (
    <Pressable onPress={onPress} disabled={disabled} _disabled={{ opacity: 0.6 }}>
      <ListBorderTile>
        <HStack space={4}>
          <Box p={"2"} borderRadius={"md"} backgroundColor={iconBackgroundColor}>
            <Icon type={icon} color={"white"} size={"1em"} />
          </Box>
          <Text fontSize={"16"} alignSelf={"center"}>
            {title}
          </Text>
        </HStack>
        <ChevronRightIcon color={"secondary.900"} />
      </ListBorderTile>
    </Pressable>
  );
};



const SettingsScreen = () => {
  const router = useRouter()
  const { businessId } = router.query
  const { data } = useGetClientInformation()
  const { data: tabInfo } = useGetTabInformation()
  const isAdmin = tabInfo?.getTabByID?.admin === data?.getClientInformation?._id
  const tabId = tabInfo?.getTabByID?._id
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  const handlePress = (title: string) => {
    switch (title) {
      case "qrcode":
        setIsModalOpen(true)
        break;
      default:
        break;
    }
  }

  const shouldBeDisabled = useCallback((title: string) => {
    switch (title) {
      case "qrcode":
        return !isAdmin || !tabId
      default:
        return false
    }
  }, [isAdmin, tabId])

  return (
    <VStack space="4" px={"2"}>
      <ListBorderTile>
        <HStack space={4}>
          <Avatar source={{ uri: DICE_BEAR_INITIALS_URL(data?.getClientInformation?.name ?? "?") }} />
          <VStack space={1}>
            <Text fontSize={"16"}>
              {data?.getClientInformation?.name}
            </Text>
            <Badge colorScheme="warning" alignSelf="center" variant={"outline"}>
              {`Tab ${isAdmin ? "Admin" : "Guest"}`}
            </Badge>
          </VStack>
        </HStack>
        <ChevronRightIcon color={"secondary.900"} />
      </ListBorderTile>
      {settingsTiles.map((tile, index) => (
        <SettingsTile
          _id={tile._id}
          key={index}
          icon={tile.icon}
          title={tile.title}
          iconBackgroundColor={tile.iconBackgroundColor}
          onPress={() => handlePress(tile._id)}
          disabled={shouldBeDisabled(tile._id)}
        />
      ))}
      <CustomModal
        size={"xl"}
        onClose={() => setIsModalOpen(false)}
        isOpen={isModalOpen}
        ModalBody={
          <Center flex={1}>
            <QRCode
              value={`${process.env.FRONTEND_URL}${clientRoute.home(businessId as string)}/?tab=${tabInfo?.getTabByID?._id}`}
              size={300}
              level={"L"}
            />
          </Center>
        }
      />
    </VStack>

  );
};

export { SettingsScreen };
