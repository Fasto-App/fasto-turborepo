//@ts-nocheck
import React, { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Image,
  StyleSheet
} from "react-native";
import { AddonCheckbox } from "../../components/atoms/AddonCheckbox";
import { DismissButton } from "../../components/atoms/DismissButton";
import { useClientContext } from "../../appProvider";
import { Box, Button, Container, Pressable, TextArea, Text, ScrollView } from "native-base";
// import { useClientContext } from "../../pages/_app";
// import { DismissButton } from "../../../components/atoms/DismissButton";
// import { AddonCheckbox } from "../../../components/atoms/AddonCheckbox";
// import { colors } from "../../../theme/colors";
// import { DismissButton } from "";
// import { AddonCheckbox } from "@/organisms";
// import { useSpring, animated } from "react-spring";
// import { TextBox } from "../../molecules";
// import { OrderData } from "@/utils/types";
// import { styles } from "./styles";

// download react-spring
// const Box = animated(Box);

const item = {
  restaurant_id: 3456789876543,
  id: Math.floor(Math.random() * 999999),
  status: "pending",
  customer_id: null,
  uri:
    "https://assets.bonappetit.com/photos/597f6564e85ce178131a6475/master/w_1200,c_limit/0817-murray-mancini-dried-tomato-pie.jpg",
  name: "Regular Coffee",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  quantity: 1,
  subtotal: 1.5,
  addons: [
    { name: "Cheese", price: "$2,50", selected: false },
    {
      name: "Pickles",
      price: "$4,50",
    },
    {
      name: "Peperoni",
      price: "$3,50",
    },
  ],
  pricing: [
    {
      price: 2.25,
      currency: "USD",
      priceString: "$2.25",
    },
  ],
  price: 2.25,
};


// Buttons are working as expected
function IncrementButtons({ setQuantity, quantity }) {
  return (
    <Box style={styles.incrementContainer}>
      <Pressable
        style={styles.incrementHitArea}
        disabled={quantity <= 1}
        onPress={() => setQuantity((prev) => prev - 1)}
      >
        <Text style={styles.incrementButton}>-</Text>
      </Pressable>
      <Text style={styles.incrementText}>{quantity}</Text>
      <Pressable
        style={styles.incrementHitArea}
        onPress={() => setQuantity((prev) => prev + 1)}
      >
        <Text style={styles.incrementButton}>+</Text>
      </Pressable>
    </Box>
  );
}


// Header is working as expected
const HeaderList = ({ quantity, setQuantity, item }) => {


  return (
    <Box style={{ borderWidth: 1 }}>
      <Image style={styles.image} alt="logo" source={{ uri: item.uri }} label="image" />
      <Box style={styles.titleContainer}>
        <Text style={styles.title}>{item.name}</Text>
        <Text>{item.description}</Text>
      </Box>
      <Box style={styles.addDishContainer}>
        <IncrementButtons quantity={quantity} setQuantity={setQuantity} />
      </Box>
    </Box>
  );
};

const ProductDescriptionScreen = () => {
  // upon users click, store the selected item in the state
  const route = useRouter();
  const clientAppContext = useClientContext()
  const {
    state: {
      selectedItem,
      modifyItem
    },
  } = clientAppContext

  const [isBrowser, setIsBrowser] = useState(false);
  const [quantity, setQuantity] = useState(modifyItem?.quantity || 1);
  const [text, setText] = useState();
  const [items, setItems] = useState([item?.addons]);
  const isEditMode = route.query?.edit?.toString() === "true";

  // side effects
  useEffect(() => setIsBrowser(true), []);

  // I don't even remember what this hook does
  // useEffect(() => {
  //   if (quantity > items.length) {
  //     setItems((prev) => [...prev, modifyItem.addons]);
  //   } else if (quantity < items.length) {
  //     setItems((prev) =>
  //       prev.filter((_item, index) => index !== prev.length - 1)
  //     );
  //   }
  // }, [items.length, modifyItem?.addons, quantity]);

  const _editItemOnPress = async () => {
    try {
      alert("We are adding your oder");
      // refetch();
      route.back();
    } catch {

      alert("ERROR");
    }
  };

  // handle functions
  const _addToCartOnPress = async () => {



    // send this order to the kitchen and dismiss modal
    // create an order object
    // calculate price


  };

  const _onChangeText = (e) => {

    // setText(e.target.value)
  };

  const [flip, set] = React.useState(false);
  // const springProps = useSpring({
  //   to: { opacity: 1, marginTop: 0 },
  //   from: { opacity: 0, marginTop: 900 },
  // });

  const _onPress = () =>
    isEditMode ? _editItemOnPress() : _addToCartOnPress();



  return (
    <>
      <ScrollView h="100%" _contentContainerStyle={{ w: "100%", paddingBottom: "10" }}>
        <Box style={styles.dismissContainer}>
          <DismissButton onPress={() => route.back()} />
        </Box>
        <HeaderList
          quantity={quantity}
          setQuantity={setQuantity}
          item={item}
        />
        <Box style={{ width: "100%" }}>
          {items.length &&
            items.map((item, index) => (
              <AddonCheckbox
                key={index}
                item={item}
                setItems={setItems}
                position={index}
              />
            ))}
        </Box>
        {/* onChangeText={_onChangeText} text={text} */}
        <TextArea
          onChange={_onChangeText}
          value={text}
          placeholder="Add a note to your order"
          color="primary" autoCompleteType={""}
        />

      </ScrollView>
      <Box
        style={{
          position: "absolute",
          borderWidth: 1,
          width: "100%",
          padding: 10,
          bottom: 10, // logic for apps not installed
          // backdropFilter: "blur(1px)",
        }}
      >
        <Button disabled={false} onPress={_onPress} size={"lg"} bg={"secondary.500"}>
          {isEditMode ? "Edit" : "Add to cart"}
        </Button>
      </Box>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    // height: "100%",
    display: "flex",
    paddingBottom: 70,
    // justifyContent: "center",
    // alignItems: "center",
    // backgroundColor: "pink",
  },
  bottomText: {
    height: 60,
  },
  image: { height: "calc(100vh / 4)", width: "100%" },
  titleContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: 25,
  },
  dismissContainer: {
    position: "fixed",
    left: 0,
    top: 0,
    backgroundColor: "rgba(52, 52, 52, 0)",
    zIndex: 99,
  },
  addDishContainer: {
    flexDirection: "row",
  },
  addButtonContainer: {
    backgroundColor: "rgba(52, 52, 52, 0.05)",
    position: "fixed",
    bottom: 0,
    // marginBottom: 20,
    width: "100%",
    // border: "1px solid red",
    // filter: "blur(8px)",
    // webkitFilter: "blur(8px)"
  },
  incrementContainer: {
    flexDirection: "row",
    padding: 20,
  },
  incrementHitArea: {
    padding: 10,
  },
  incrementButton: {
    height: 20,
    width: 20,
    borderRadius: "50%",
    borderWidth: 1,
    textAlign: "center",
  },
  incrementText: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: 10,
  },
});

export { ProductDescriptionScreen };
