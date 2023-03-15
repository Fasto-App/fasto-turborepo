import React, { FC } from "react";
import QRCode from "react-qr-code";
import { Avatar, Box, Center, ChevronRightIcon, HStack, Text, VStack } from "native-base";
import { DICE_BEAR_INITIALS_URL } from "app-helpers";
import { Icon, NavigationButton } from "../../components/atoms/NavigationButton";
import { NavigationButtonType } from "../../components/types";
import { ILinearGradientProps } from "native-base/lib/typescript/components/primitives/Box/types";
import { ResponsiveValue, ColorType } from "native-base/lib/typescript/components/types";

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
  icon: NavigationButtonType;
  iconBackgroundColor: ResponsiveValue<ColorType | ILinearGradientProps>;
  title: string;
}

const settingsTiles: SettingsTileProps[] = [
  {
    icon: "Message",
    title: "Message Staff",
    iconBackgroundColor: "amber.500"
  },
  {
    icon: "QRCode",
    title: "Share QR Code",
    iconBackgroundColor: "blueGray.500"
  },
  {
    icon: "Contacts",
    title: "Invite User",
    iconBackgroundColor: "indigo.500"
  },
  {
    icon: "Settings",
    title: "Message Staff",
    iconBackgroundColor: "emerald.500"
  }
]

const SettingsTile: FC<SettingsTileProps> = ({ icon, title, iconBackgroundColor }) => {
  return (
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
  );
};



const SettingsScreen = () => {

  return (
    <VStack space="4" px={"2"}>
      <ListBorderTile>
        <HStack space={4}>
          <Avatar source={{ uri: DICE_BEAR_INITIALS_URL("AL") }} />
          <VStack>
            <Text fontSize={"16"} alignSelf={"center"}>
              Alex Mendes
            </Text>
            <Text color="secondary.900" italic>
              Tab Admin
            </Text>
          </VStack>
        </HStack>
        <ChevronRightIcon color={"secondary.900"} />
      </ListBorderTile>
      {settingsTiles.map((tile, index) => (
        <SettingsTile
          key={index}
          icon={tile.icon}
          title={tile.title}
          iconBackgroundColor={tile.iconBackgroundColor} />
      ))}
      {/* <Box borderWidth={1} >
        <QRCode
          value="https://www.youtube.com/watch?v=4r_w6-6rjHY&ab_channel=CortesdoFlow%5BOFICIAL%5D"
          size={200}
          level={"L"}
        />
      </Box> */}
    </VStack>

  );
};

export { SettingsScreen };
