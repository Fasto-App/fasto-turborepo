//@ts-nocheck
import React from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
// import { MenuItem } from "../molecules";
import { useRouter } from "next/router";
import { MenuItem } from "../molecules/MenuItem";

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 8,
    borderColor: "#424242",
    borderBottomWidth: 1,
  },
  contentContainer: {
    // height: "auto",
    // flexDirection: "row",
    // margin: 5,
    flex: 1,
  },
  tab: {
    height: "100%",
    // flex: 1,
    width: "auto",
  },
  last: {
    marginRight: 0,
  },
  selected: {
    borderBottomWidth: 3,
    borderColor: "red",
  },
  title: {
    width: "100%",
    padding: 8,
  },
  bottomContainer: {
    flex: 1,
  },
});

const Tab = (props) => {
  const { title, index, setSelectedIndex, last, selected } = props;
  const tabStyles = [styles.tab, selected && styles.selected];

  return (
    <TouchableOpacity style={tabStyles} onPress={() => setSelectedIndex(index)}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

function Menu(props) {
  const { setShow, menu, setSelectedItem } = props;
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const sections = React.useMemo(() => menu.menu_sections, [menu]);
  const menu_items = React.useMemo(
    () =>
      sections && sections[selectedIndex] && sections[selectedIndex].menu_items,
    [sections, selectedIndex]
  );

  const route = useRouter();

  const onMenuItemPress = (_evt, { item }) => {

    // on click, we need to set the item selected to display on the ProductDescriptionScreen
    route.push("/client/product-description");
  };

  return (
    <React.Fragment>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.contentContainer} horizontal>
          {sections.length &&
            sections.map((item, index) => (
              <Tab
                key={`$${item.section_name}_${index}`}
                title={item.section_name}
                index={index}
                selected={index === selectedIndex}
                setSelectedIndex={setSelectedIndex}
                last={sections.length - 1 === index}
              />
            ))}
        </ScrollView>
      </View>
      <View style={styles.bottomContainer}>
        {menu_items.length && (
          <FlatList
            data={menu_items}
            renderItem={(itemProps, index) => (
              <TouchableOpacity
                onPress={(_evt) => onMenuItemPress(_evt, itemProps)}
              >
                <MenuItem {...itemProps} />
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => `${item.name}_${index}`}
          />
        )}
      </View>
    </React.Fragment>
  );
}

export { Menu };
