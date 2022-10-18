import { Box, Flex } from "native-base";
import React from "react";
import { StyleSheet, View, ScrollView } from "react-native-web";
import { ClientNavBar } from "./ClientNavbar";
import { TabBar } from "../../components/molecules/TabBar";
import { colors } from "../../theme/colors";
import { ClientTabBar } from "./ClientTabBar";

const styles = StyleSheet.create({
  container: {

    flex: 1,
    flexDirection: "space-between",
    backgroundColor: colors.pureWhite,
    height: "100vh",
    justifyContent: "space-between",
  },
  main: {
    // the size of the main content is whatever is left from the navigation - the tab bar
    height: "100%",
  },
});

const ClientLayout = ({ children }) => {
  return (
    <Flex flexDirection="column" justifyContent={"space-between"} h={"100%"} bg={"white"}>
      <View style={{ flex: 10 }}>
        <ClientNavBar />
        <ScrollView style={styles.main}>{children}</ScrollView>
      </View>
      <ClientTabBar />
    </Flex>
  );
};

export { ClientLayout };
