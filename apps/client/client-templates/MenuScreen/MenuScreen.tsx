import React, { useEffect, useState } from "react";
import { Box, ScrollView, Text } from "native-base"
import { Menu } from "../../components/organisms/Menu";
import { colors } from "../../theme/colors";
import { texts } from "./texts";
import { MenuItem } from "../../components/molecules/MenuItem";

// create array with 10 items
const items = Array.from(Array(10).keys());

export const MenuScreen = () => {

  return (

    // bring focus to scrollview


    <ScrollView focusable >
      {items.map((item, index) =>
        <MenuItem key={index} />
      )}
    </ScrollView>

  );
};

