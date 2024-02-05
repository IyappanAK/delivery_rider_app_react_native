import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";

import { useSharedValue, withTiming } from "react-native-reanimated";

import React, { useEffect, useLayoutEffect, useState } from "react";

import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

import { Link, useNavigation } from "expo-router";
import useBasketStore from "@/store/basketStore";

import { getAllMenus, getUserInfo, updateFavMenus } from "@/core/services/home";
import { useRoute } from "@react-navigation/native";

import { SafeAreaView } from "react-native-safe-area-context";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import useCommonStore from "@/store/commonStore";
import { useQueryClient } from "@tanstack/react-query";
import { queries } from "@/core/constants/queryKeys";

const Details = () => {
  const route = useRoute();
  const opacity = useSharedValue(0);

  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const [isFav, setIsFav] = useState();
  const { total, addProduct, products } = useBasketStore();

  const data = route?.params?.data;
  const allMenus = getAllMenus({});

  const user = getUserInfo({ enabled: false });
  const { setUserInfo, userInfo } = useCommonStore();

  const FEES = {
    service: 10,
    delivery: 10,
  };

  const updateMenu = updateFavMenus({
    onSuccess: () => {
      user.refetch();
      queryClient.invalidateQueries({
        queryKey: queries.home.userAddress.queryKey,
      });
      ToastAndroid.showWithGravity(
        "Favourites updated",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    },
    onError: () => {
      ToastAndroid.showWithGravity(
        "Something Went Wrong",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    },
  });

  const addToCart = (data: any) => {
    addProduct(data);
    ToastAndroid.showWithGravity(
      "Item Added to Cart",
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
  };

  function changeFav() {
    updateMenu.mutate(data);
  }

  useEffect(() => {
    setUserInfo(user.data);
  }, [user.data]);

  useEffect(() => {
    setIsFav(userInfo?.favoriteMenus?.some((obj: any) => obj.id === data.id));
  }, [userInfo]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
      headerTintColor: Colors.primary,
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.roundButton}>
          <Ionicons name="chevron-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={styles.bar}>
          <TouchableOpacity style={styles.roundButton} onPress={changeFav}>
            {isFav ? (
              <Ionicons name="heart" size={24} color={Colors.primary} />
            ) : (
              <Ionicons name="heart-outline" size={25} color={Colors.primary} />
            )}
          </TouchableOpacity>
        </View>
      ),
    });
  }, [isFav]);

  const onScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    if (y > 350) {
      opacity.value = withTiming(1);
    } else {
      opacity.value = withTiming(0);
    }
  };

  return (
    <>
      <ParallaxScrollView
        scrollEvent={onScroll}
        backgroundColor={Colors.primaryBg}
        style={{ flex: 1 }}
        parallaxHeaderHeight={250}
        stickyHeaderHeight={100}
        renderBackground={() => (
          <Image
            source={{ uri: data?.image }}
            style={{ height: 300, width: "100%" }}
          />
        )}
        contentBackgroundColor={Colors.lightGrey}
        renderStickyHeader={() => (
          <View key="sticky-header" style={styles.stickySection}>
            <Text style={styles.stickySectionText}>{data?.name}</Text>
          </View>
        )}>
        <View style={styles.detailsContainer}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
            <Text style={styles.restaurantName}>{data?.name}</Text>
            <Text style={styles.price}>₹{data?.price}</Text>
          </View>

          <Text style={styles.restaurantDescription}>{data?.description}</Text>
          <TouchableOpacity
            style={{ flex: 1, alignItems: "flex-end", marginHorizontal: 16 }}
            onPress={() => addToCart(data)}>
            <Text style={styles.add}>Add</Text>
          </TouchableOpacity>

          <Text style={styles.sectionHeader}>Recommended for You</Text>
          {allMenus?.data?.map((obj: any) => (
            <ShowMenus data={obj} addToCart={addToCart} />
          ))}
        </View>
      </ParallaxScrollView>

      {products?.length > 0 && (
        <View style={styles.footer}>
          <SafeAreaView edges={["bottom"]} style={{ backgroundColor: "#fff" }}>
            <Link href="/basket" asChild>
              <TouchableOpacity style={styles.fullButton}>
                <Text style={styles.basket}>{products.length} Qty</Text>
                <Text style={styles.footerText}>View Basket</Text>
                <Text style={styles.basketTotal}>
                  ₹{(total + FEES.service + FEES.delivery)?.toFixed(2)}
                </Text>
              </TouchableOpacity>
            </Link>
          </SafeAreaView>
        </View>
      )}

    </>
  );
};

const ShowMenus = (props: any) => {
  const { data, addToCart } = props;
  return (
    <Link<{ pathname: any; params: { id: any; data: any } }>
      href={{
        pathname: "/(modal)/dish",
        params: { id: data.id, data: JSON.stringify(data) },
      }}
      asChild>
      <TouchableOpacity style={styles.item}>
        <View style={{ flex: 1 }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={styles.dish}>{data.name}</Text>
          </View>
          <Text style={styles.dishText}>
            {data.description?.length > 30
              ? `${data.description?.slice(0, 2 * 40)}..`
              : data.description}
          </Text>
          <Text style={styles.dishText}>${data.price}</Text>
        </View>
        <View style={styles.container}>
          <Image source={{ uri: data.image }} style={styles.dishImage} />
          <View style={styles.plusIconContainer}>
            <TouchableOpacity onPress={() => addToCart(data)}>
              <Ionicons name="add-circle" size={26} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  detailsContainer: {
    backgroundColor: Colors.primaryBg,
  },
  stickySection: {
    backgroundColor: "#fff",
    marginLeft: 70,
    height: 138,
    justifyContent: "center",
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  stickySectionText: {
    fontSize: 20,
    marginVertical: 10,
  },
  restaurantName: {
    fontSize: 30,
    margin: 16,
  },
  price: {
    fontSize: 24,
    margin: 16,
    fontWeight: "700",
  },
  restaurantDescription: {
    fontSize: 16,
    margin: 16,
    marginTop: 0,
    lineHeight: 22,
    color: Colors.medium,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 40,
    margin: 16,
  },
  item: {
    backgroundColor: "#fff",
    padding: 16,
    flexDirection: "row",
    borderBottomColor: Colors.grey,
    borderBottomWidth: 1,
  },
  dishImage: {
    height: 80,
    width: 80,
    borderRadius: 4,
  },
  dish: {
    fontSize: 16,
    fontWeight: "bold",
  },
  dishText: {
    fontSize: 14,
    color: Colors.mediumDark,
    paddingVertical: 4,
  },
  stickySegments: {
    position: "absolute",
    height: 50,
    left: 0,
    right: 0,
    top: 100,
    backgroundColor: "#fff",
    overflow: "hidden",
    paddingBottom: 4,
  },
  segmentsShadow: {
    backgroundColor: "#fff",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    width: "100%",
    height: "100%",
  },
  segmentButton: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 50,
  },
  segmentText: {
    color: Colors.primary,
    fontSize: 16,
  },
  segmentButtonActive: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 50,
  },
  segmentTextActive: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  segmentScrollview: {
    paddingHorizontal: 16,
    alignItems: "center",
    gap: 20,
    paddingBottom: 4,
  },
  footer: {
    position: "absolute",
    backgroundColor: "#fff",
    bottom: 0,
    left: 0,
    width: "100%",
    padding: 10,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    paddingTop: 20,
  },
  fullButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    height: 50,
  },
  footerText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  basket: {
    color: "#fff",
    backgroundColor: Colors.primary,
    fontWeight: "bold",
    padding: 8,
    borderRadius: 2,
  },
  basketTotal: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  container: {
    position: "relative",
  },

  plusIconContainer: {
    position: "absolute",
    top: -4,
    right: -8,
    backgroundColor: "white",
    width: 30,
    height: 30,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  add: {
    fontSize: 16,
    padding: 8,
    paddingHorizontal: 16,
    color: "white",
    fontWeight: "800",
    borderRadius: 8,
    backgroundColor: Colors.primary,
  },
});

export default Details;
