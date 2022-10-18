import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
} from "react-native-web";
import { colors } from "../../theme/colors";

const styles = StyleSheet.create({
  sectionContainer: {
    justifyContent: "center",
    backgroundColor: colors.ghostWhite,
    flex: 1,
    display: "flex",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    backgroundColor: colors.blue,
    color: colors.ghostWhite,
    padding: 10,
  },
  sectionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    display: "flex",
    flex: 1,
    borderBottomColor: colors.darkBlue,
    borderBottomWidth: 1,
  },
  left: {
    display: "flex",
    flex: 3,
    width: "100%",
    justifyContent: "center",
  },
  right: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    flexWrap: "nowrap",
    width: "30%",
  },
  itemName: {
    fontSize: 18,
    fontWeight: 500,
    paddingBottom: 5,
    paddingTop: 5,
    color: colors.darkBlue,
  },
  ingredients: {
    paddingBottom: 5,
    fontStyle: "italic",
    color: "gray",
  },
  price: {
    fontsize: 16,
    textAlign: "center",
    justifyContent: "center",
    fontWeight: 700,
    display: "flex",
    color: colors.orange,
    position: "absolute",
    backgroundColor: "yellow",
    borderColor: colors.orange,
    borderWidth: 1,
    borderRadius: 5,
  },
  priceWithPhoto: {
    float: "right",
    top: 0,
    right: 0,
    marginVertical: 5,
  },
  logo: {
    width: 70,
    height: 70,
  },
});

const MenuItem = (sectionCellProps) => {

  const { name, ingredients, price, uri } = sectionCellProps;
  const formatIngredients = "Tomate, Milho, Ervilha.";
  const formatPrice = (() => {
    // '(price) => (price / 100).toFixed(2)';
    return "$29.00";
  })();

  return (
    <View style={styles.sectionItem}>
      <View style={styles.left}>
        <Text style={styles.itemName}>{name}</Text>
        <Text style={styles.ingredients}>{formatIngredients}</Text>
      </View>
      <View style={styles.right}>
        {uri && <Image style={styles.logo} source={{ uri: uri }} alt={"Text"} />}
        <Text style={[styles.price, uri && styles.priceWithPhoto]}>
          {formatPrice}
        </Text>
      </View>
    </View>
  );
};

export { MenuItem };
