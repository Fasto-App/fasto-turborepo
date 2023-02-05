import React, { Fragment, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Pressable,
  Text,
} from "react-native";
// import { Text, Link } from "shared/components/atoms";
import { useRouter } from "next/router";

const styles = ({ index }: { index: number }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      //   borderWidth: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: index % 2 === 0 ? "#ededed" : "white",
    },
    image: {
      height: 40,
      width: 70,
    },
    button: {
      width: 50,
      paddingVertical: 5,
      fontSize: 18,
      textAlign: "center",
      margin: "auto",
      borderWidth: 1,
      borderRadius: 5,
      backgroundColor: "white",
    },
    text: {
      // textAlign: "center",
      // textAlignVertical: "center",
      // margin: "auto",
      // marginHorizontal: 10,
    },
  });

type BagItem = {
  order: any;
  index: number;
  refetch: () => void;
};

const states = ["🗑", "⏳", "✅"];

const CartTile = (props: BagItem) => {
  const { order, index, refetch } = props;
  const [expand, setExpand] = useState(true);

  const route = useRouter();

  const _editItemOnPress = (item: any) => {

    route.push({ pathname: "/product-description", query: { edit: true } });
  };

  const _deleteItemOnPress = async () => {

    const deleteResponse = await fetch(
      `http://localhost:3004/orders/${order.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const deleteResponseJson = await deleteResponse.json();

    refetch();
  };

  return (
    <Pressable>
      <Fragment>
        <View style={styles(props).container}>
          <View style={{ flexDirection: "row" }}>
            <Image
              style={styles(props).image}
              source={{ uri: order.uri }}
            />
            <View
              style={{ marginHorizontal: 10, justifyContent: "space-between" }}
            >
              <Text>{order.name}</Text>
              <Text>x{order.quantity}</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View
              style={{ alignItems: "center", margin: "auto", marginRight: 5 }}
            >
              <Text>$ {order.subtotal}</Text>
              <Text onPress={() => _editItemOnPress(order)}>edit</Text>
            </View>
            <Pressable onPress={_deleteItemOnPress}>
              <Text style={styles(props).button}>{states[0]}</Text>
            </Pressable>
          </View>
        </View>
      </Fragment>
    </Pressable>
  );
};

export { CartTile };
