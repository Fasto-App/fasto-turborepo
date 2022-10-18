import * as React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native-web";

const styles = StyleSheet.create({
  button: {
    height: 40,
    width: 40,
    borderRadius: 40,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    lineHeight: 40,
  },
});

const DismissButton = (props: any) => {
  const { onPress } = props;
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.button}>X</Text>
    </TouchableOpacity>
  );
};

export { DismissButton };
