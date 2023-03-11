// TODO
//@ts-nocheck
import { Button } from "native-base";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { CartTile } from "../../components/organisms/CartTile";

const CartScreen = () => {

  const orders = []
  const isLoading = false;
  const error = false;
  const putOrder = (order) => undefined;

  const pendingToInProgress = orders?.reduce((resultsArray, orderObject) => {
    if (orderObject.status === "pending") {
      resultsArray.push({ ...orderObject, status: "in-progress" });
    }
    return resultsArray;
  }, []);

  const pendindOrders = orders?.filter((order) => order.status === "pending");
  const completedOrders = orders?.filter(
    (order) => order.status === "completed"
  );
  const inProgressOrders = orders?.filter(
    (order) => order.status === "in-progress"
  );

  const _onPress = () => {
    // loop through the orders and create a axios request to update the status

    pendingToInProgress.forEach((order) => putOrder(order));
  };

  if (isLoading) {

    return null;
  }
  if (error || !orders) {

    return null;
  }

  return (
    <>
      <View style={styles.bagTemplateContainer}>
        <Text style={styles.title}>Orders</Text>
        {orders.length ? (
          orders.map((order, index) => (
            <CartTile
              key={index}
              index={index}
              order={order}
              refetch={() => undefined}
            />
          ))
        ) : (
          <TouchableOpacity>
            <Text>Empty bag. Go to a different screen</Text>
          </TouchableOpacity>
        )}
      </View>
      {orders && <Button onPress={_onPress}>Send to the Kitchen</Button>}
    </>

  );
};

export { CartScreen };


const styles = StyleSheet.create({
  bagTemplateContainer: {
    padding: 8,
    justifyConte: "center",
  },
  title: {
    fontSize: 22,
    // borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    textAlign: "center",
    textAlignVertical: "center",
  },
});
