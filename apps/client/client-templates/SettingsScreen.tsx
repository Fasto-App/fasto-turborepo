// import { TextBox } from "../../molecules";
// import { Layout } from "@/organisms";
import { View, Text, StyleSheet } from "react-native-web";
import React from "react";
// import { Button, Text } from "shared/components/atoms";
import QRCode from "react-qr-code"; // react native needs react-svg
import { Button, TextArea } from "native-base";
// import { styles } from "./styles";
// import { io } from "socket.io-client";

// const socket = io("http://localhost:4000");
// 

const SettingsScreen = () => {
  const onPress = () => console.log("PRESS");

  return (
    <View>
      <View>
        <Text>Lorem ipsum</Text>
        <Text>Lorem ipsum</Text>
        <Text>Lorem ipsum</Text>
        <Text>Lorem ipsum</Text>
      </View>
      <View style={styles.container}>
        <QRCode
          value="https://www.youtube.com/watch?v=4r_w6-6rjHY&ab_channel=CortesdoFlow%5BOFICIAL%5D"
          size={200}
          // title={"Connect your firends to your tab"}
          level={"L"}
        />
      </View>

      <View
        style={{
          // position: "absolute",
          width: "100%",
          height: "100%",
          bottom: 0, // logic for apps not installed
          backdropFilter: "blur(1px)",
        }}
      >
        <TextArea
          // onChange={_onChangeText}
          // value={text}
          // label="text area"
          color="primary" autoCompleteType={undefined} />
        <Button disabled={false} onPress={onPress} size={"lg"}>
          Add to cart
        </Button>
      </View>
    </View>

  );
};

export { SettingsScreen };

const styles = StyleSheet.create({
  container: {
    // paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
    // flex: 1,
  },
});
