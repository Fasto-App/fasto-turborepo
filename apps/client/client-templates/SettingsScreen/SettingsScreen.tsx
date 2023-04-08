import React, { FC, useCallback, useMemo } from "react";
import { Avatar, Badge, Box, ChevronRightIcon, ChevronDownIcon, HStack, Text, VStack, Pressable } from "native-base";
import { DICE_BEAR_INITIALS_URL } from "app-helpers";
import { Icon } from "../../components/atoms/NavigationButton";
import { NavigationButtonType } from "../../components/types";
import { ILinearGradientProps } from "native-base/lib/typescript/components/primitives/Box/types";
import { ResponsiveValue, ColorType } from "native-base/lib/typescript/components/types";
import { useGetClientInformation, useGetClientSession } from "../../hooks";
import { clientRoute } from "../../routes";
import { useRouter } from "next/router";
import { PendingInvitationModal } from "./PendingInvitationModal";
import { QRCodeReaderModal } from "./QRCodeReaderModal";

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

const texts = {
  guests: "Guests",
}

const settingsTiles = [
  {
    _id: "qrcode",
    icon: "QRCode",
    title: "Invite Guest With QR Code",
    iconBackgroundColor: "blueGray.500" //"amber.500"
  },
  {
    _id: "invitations",
    icon: "People",
    title: "Pending Invitations",
    iconBackgroundColor: "violet.500" //"indigo.500"
  }
] as const

type SettingsTileId = typeof settingsTiles[number]["_id"]

const FE_URL = new URL(process.env.FRONTEND_URL ?? "http://localhost:3000")

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
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isModalOpen2, setIsModalOpen2] = React.useState(false)

  const router = useRouter()
  const { businessId } = router.query

  const { data } = useGetClientInformation()
  const { data: tabInfo } = useGetClientSession()

  const isAdmin = tabInfo?.getClientSession?.tab?.admin === data?.getClientInformation?._id
  const tabId = tabInfo?.getClientSession.tab?._id

  const QR_CODE = useMemo(() => {
    if (typeof businessId !== "string" || !tabId || !data?.getClientInformation.name) return undefined

    FE_URL.pathname = clientRoute.home(businessId)
    FE_URL.searchParams.append("tabId", tabId)
    FE_URL.searchParams.append("name", data?.getClientInformation.name)
    FE_URL.searchParams.append("adminId", data?.getClientInformation._id)
    return FE_URL.toString()
  }, [businessId,
    data?.getClientInformation._id,
    data?.getClientInformation.name, tabId])

  const handlePress = useCallback((title: SettingsTileId) => {
    switch (title) {
      case "qrcode":
        setIsModalOpen(true)
        break;
      case "invitations":
        setIsModalOpen2(true)
        break;
      default:
        break;
    }
  }, [])

  const shouldBeDisabled = useCallback((title: SettingsTileId) => {
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
        {/* <ChevronRightIcon color={"secondary.900"} /> */}
      </ListBorderTile>
      <Box backgroundColor={"white"} borderRadius={"md"}>
        <UsersAccordion users={tabInfo?.getClientSession.tab?.users} />
      </Box>
      {settingsTiles.map((tile, index) => (
        // if not admin, disable the QR Code and the Pending Invitations tiles
        !isAdmin && tile._id === "qrcode" || !isAdmin && tile._id === "invitations" ? null : (
          <SettingsTile
            _id={tile._id}
            key={index}
            icon={tile.icon}
            title={tile.title}
            iconBackgroundColor={tile.iconBackgroundColor}
            onPress={() => handlePress(tile._id)}
            disabled={shouldBeDisabled(tile._id)}
          />
        )
      ))}
      <QRCodeReaderModal QR_CODE={QR_CODE || ""}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <PendingInvitationModal
        isModalOpen={isModalOpen2}
        setIsModalOpen={setIsModalOpen2}
      />
    </VStack>

  );
};

export { SettingsScreen };

const UsersAccordion = (props: { users?: { _id: string; name?: string | null, __typename?: "User" }[] | null }) => {
  const { users } = props
  const [collapsed, setCollapsed] = React.useState(false)

  if (!users || users?.length === 0) return null

  return (
    <Pressable onPress={() => setCollapsed(!collapsed)}>
      <VStack>
        <ListBorderTile>
          <HStack space={2}>
            <Avatar.Group
              _avatar={{
                size: "sm",
              }}
              max={3}
            >
              {users.map((user, i) => (<Avatar key={i} bg="green.500" source={{
                uri: DICE_BEAR_INITIALS_URL(user.name ?? "?")
              }}>
                {user.name}
              </Avatar>))}
            </Avatar.Group>
            <Text fontSize={"16"} alignSelf={"center"}>
              {texts.guests}
            </Text>
          </HStack>
          {collapsed ? <ChevronDownIcon color={"secondary.900"} /> :
            <ChevronRightIcon color={"secondary.900"} />}
        </ListBorderTile>
        {collapsed ? <VStack
          backgroundColor={"white"}
          space={2}
          borderRadius={"md"}
          px={2}
          pb={2}
        >
          {users.map((user, i) => <HStack key={i} space={4} >
            <Avatar size={"sm"} bg="green.500" source={{
              uri: DICE_BEAR_INITIALS_URL(user.name ?? "?")
            }}>
              {user.name}
            </Avatar>
            <Text fontSize={"16"} alignSelf={"center"}>
              {user.name}
            </Text>
          </HStack>)}
        </VStack> : null}
      </VStack>
    </Pressable>
  )
};