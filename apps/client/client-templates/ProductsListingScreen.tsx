import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  SafeAreaView,
  Image,
  Text
} from "react-native-web";
import { NextRouter } from "next/router";

// import ProductDescriptionTemplate from "../ProductDescriptionScreen/ProductDescriptionScreen";
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";
// import { WelcomeModal } from "components/organisms/WelcomeModal";
// import { RestaurantData } from "@/utils/types";
// import { getBusinessDataByID, getRestaurants } from "adapters/axios";
import { Menu } from "../components/organisms/Menu";
import { useQuery } from "@apollo/client";
import { colors } from "../theme/colors";

const bussinessId = "4072702673999819";

const ProductsListingScreen = ({
  data: initialData,
}: {
  data: any;
}) => {

  const data = {
    menus: [],
  }

  // const { data, isLoading } = useQuery(
  //   ["items-by-businnes", bussinessId],
  //   () => getBusinessDataByID(bussinessId),
  // );

  const [session, setSession] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [show, setShow] = useState(false);
  const [orders, setOrders] = useState([]);

  // check if user is has chooses an history

  useEffect(() => {
    // create a token on the front end and have that as the session data to be `attached` to the tab
    // set the session_id to be saved on redux
    const session_id = localStorage.getItem("session_id");
    if (session_id) return
    else localStorage.setItem("session_id", Date.now().toString());
  }, []);

  return (
    <>
      <Text color={colors.charcoal}>Welcome to OpenTab</Text>
      <Text color={colors.charcoal}>
        Browse through our list of partners and find your favorites restarants
        here
      </Text>
      {data?.menus?.length && (
        <Menu
          setShow={setShow}
          menu={data.menus[0]}
          setSelectedItem={setSelectedItem}
        />
      )}
      {/* <WelcomeModal router={router} /> */}
    </>
  );
};

export async function getStaticPaths() {
  const restaurantsData = [{
    id: "4072702673999819",
    restaurants: [],
  }]

  const paths = restaurantsData.map((restaurant) => {

    return {
      params: { id: restaurant.id },
    };
  });

  return {
    paths: paths,
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {


  const data = []
  return {
    props: {
      data,
    },
  };
};

export { ProductsListingScreen };
