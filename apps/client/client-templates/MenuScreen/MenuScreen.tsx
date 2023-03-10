import React, { } from "react";
import { FlatList, ScrollView, Spacer } from "native-base"
import { MenuItem } from "../../components/molecules/MenuItem";
import { Tab } from "./Tab";
import router from "next/router";
import { clientRoute } from "../../routes";



// create array with 10 items
const items = Array.from(Array(10).keys());

// create an array with 10 names of food categories
const categories = ["Wines", "Beers", "Cocktails", "Spirits", "Soft Drinks", "Juices", "Water", "Coffee", "Tea", "Desserts"];

const renderItem = ({ item }: { item: number }) => (
  <MenuItem
    onPress={() => router.push(clientRoute.production_description("123"))}
  />)

export const MenuScreen = () => {
  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      stickyHeaderIndices={[0]}
      ListHeaderComponent={
        <>
          <ScrollView
            horizontal
            borderWidth={1}
            borderColor={"red.300"}
            backgroundColor={"white"}
            showsHorizontalScrollIndicator={false}
          >
            {categories.map((item, index) => (
              <Tab
                key={`$${item}_${index}`}
                title={item}
                index={index}
                onPress={() => console.log("setSelectedIndex")}
                last={true}
                selected={index === 1}
              />
            ))}
          </ScrollView>
          <Spacer size={"2"} />
        </>
      }
    />
  );
};

