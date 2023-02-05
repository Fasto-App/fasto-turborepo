import { Box, Flex } from "native-base";
import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { ClientNavBar } from "./ClientNavbar";
import { TabBar } from "../../components/molecules/TabBar";
import { colors } from "../../theme/colors";
import { ClientTabBar } from "./ClientTabBar";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: colors.pureWhite,
    height: "100vh",
    justifyContent: "space-between",
  },
  main: {
    height: "100%",
  },
});

const ClientLayout: React.FC = ({ children }) => {
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
