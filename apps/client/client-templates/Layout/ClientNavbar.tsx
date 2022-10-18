import React from "react"
import { StyleSheet } from "react-native"
import { useRouter } from "next/router";
import { colors } from "../../theme/colors";
import { Box, Pressable, Text, useTheme } from "native-base";
import { NavigationButton } from "../../components/atoms/NavigationButton";
import { NavigationButtonType } from "../../components/types";

const styles = StyleSheet.create({
  view: { height: 30, width: 30, zIndex: 9999 },
  section: {
    justifyContent: "center",
    textAlign: "center",
  },
  // pageTitle: {
  //   fontSize: 25,
  //   fontWeight: "bold",
  //   color: colors.white,
  // },
  logo: {
    height: 30,
    width: 30,
  },
  icon: {
    height: 30,
    width: 30,
  },
});

const texts = {
  navigationTitle: "OpenTab",
}

const ClientNavBar = (props) => {
  const router = useRouter();
  let isBackButtonAvailable = true;

  const theme = useTheme();

  return (
    <Box bg={"primary.500"} padding={"1"} flexDirection={"row"} justifyContent={"space-between"}>
      {isBackButtonAvailable && (
        <NavigationButton
          type={NavigationButtonType.ArrowBack}
          onPress={() => {
            router.back();
          }}
        />)}
      <Pressable
        style={styles.section}
        onPress={() => {
          router.push("/");
        }}
      >
        <Text color={"white"} fontSize={"md"}>{texts.navigationTitle}</Text>
      </Pressable>
      <NavigationButton
        type={NavigationButtonType.Logout}
        onPress={() => {
          router.back();
        }}
      />
    </Box>
  );
};

ClientNavBar.displayName = "ClientNavBar"

export { ClientNavBar };
