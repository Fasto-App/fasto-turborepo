//@ts-nocheck
import { Box } from "native-base";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  CheckBox,
} from "react-native";
import { colors } from "../../theme/colors";
// import { colors } from "shared/theme";


const _onChange = (value, position, index, setItems) => {
  setItems((prev) => {


    return prev.map((addon, i) => {
      if (i === index) addon.selected = value;
      return addon;
    });
  });
};

const Addon = ({ name, price, selected, setItems, index, position }) => {

  return (
    <View style={styles.checkboxContainer}>
      <CheckBox
        value={selected}
        onValueChange={(val) => _onChange(val, position, index, setItems)}
        style={styles.checkbox}
      />
      <Text style={styles.label}>{name}</Text>
      <Text style={styles.labelPrice}>+{price}</Text>
    </View>
  );
};

// this boolean values are gonna be created based on number of item.items [adds]
// item.addons // complements [{name, price}]
export const AddonCheckbox = (props) => {
  const { item: itemProp, setItems: setItemProp, position } = props;
  const [item, setItems] = React.useState(itemProp);
  const didMountRef = React.useRef(false);
  const ref = React.useRef(position);



  React.useEffect(() => {
    if (didMountRef.current) {
    } else didMountRef.current = true;
  }, [item]);

  return (
    <React.Fragment>
      <View style={styles.container}>
        {item?.length &&
          item.map((addon, index) => (
            <Addon
              key={index}
              index={index}
              position={position}
              name={addon.name}
              price={addon.price}
              selected={addon.selected}
              setItems={setItems}
            />
          ))}
      </View>
    </React.Fragment>
  );
};


const styles = StyleSheet.create({
  container: {
    // borderBottomWidth: 1,
    // borderColor: "#F3F3F3",
    // paddingVertical: 10,
    // paddingHorizontal: 20,
    flex: 1,
    // flexDirection: "row",
    // borderRadius: 5
    // justifyContent: 'space-evenly'
  },
  buttonsContainer: {
    flex: 1,
  },
  textContainer: {
    flex: 3,
  },
  imageContainer: {
    flex: 2,
    // borderWidth: 2
  },
  image: {
    right: 0,
    left: 0,
    top: 0,
    height: 100,
  },
  subtitleContainer: {
    // backgroundColor: colors.blueboard,
    borderWidth: 1,
    borderBottomWidth: 1,
    padding: 15,
    // border: colors.lightGray,
    // borderBottomColor: colors.lightGray,
  },
  subtitle: {
    color: colors.pureWhite,
    fontWeight: 500,
    fontSize: 18,
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 10,
    flex: 1,
  },
  checkbox: {
    backgroundColor: "pink",
    color: "pink",
    alignSelf: "center",
    height: 20,
    width: 20,
    // flex:1
  },
  label: {
    marginLeft: 8,
    // flex:1,
    // border: "1px solid red"
  },
  labelPrice: {
    position: "absolute",
    right: 50,
    // flex:1,
    // padding
    width: "100px",
    // height: "120px",
    // border: "3px solid blue",
  },
});