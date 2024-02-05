import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  ToastAndroid,
} from "react-native";
import React from "react";

import Colors from "@/constants/Colors";
import utils from "@/constants/utils";

import { useNavigation } from "expo-router";
import HalfBottomButton from "@/components/Buttons/HalfBottomButton";

import useBasketStore from "@/store/basketStore";
import { getUserInfo } from "@/core/services/home";

import { TouchableOpacity } from "react-native-gesture-handler";
import { RefreshControl } from "react-native";

export default function favourites() {
  const navigation = useNavigation();
  const userInfo = getUserInfo({});

  function nav() {
    navigation.goBack();
  }

  return (
    <View style={{ backgroundColor: Colors.primaryBg, flex: 1 }}>
      {userInfo?.data?.favoriteMenus?.length > 0 ? (
        <MenuCards
          data={userInfo?.data?.favoriteMenus}
          refetch={userInfo.refetch}
        />
      ) : (
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.emptyIllustration}
              source={require("@/assets/images/favourite.png")}
              resizeMode="contain"
            />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                textAlign: "center",
              }}>
              No Items Found
            </Text>
          </View>
          <View style={{ flex: 2, width: "100%" }}>
            <HalfBottomButton
              title="Explore Now"
              handleClick={nav}
              width={"50%"}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const MenuCards = (props: any) => {
  const { data, refetch } = props;
  const navigation = useNavigation();

  function nav(data: any) {
    navigation.navigate("details", { data, isFav: true });
    navigation.canGoBack(true);
  }
  const { addProduct } = useBasketStore();
  const [refreshing, setRefreshing] = React.useState(false);

  const addToCart = (data: any) => {
    addProduct(data);
    ToastAndroid.showWithGravity(
      "Item Added to Cart",
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <ScrollView
      showsVerticalScrollIndicator={true}
      contentContainerStyle={{
        paddingVertical: 24,
        alignItems: "center",
        backgroundColor: Colors.primaryBg,
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {data.map((obj: any, index: any) => (
        <View key={index}>
          <View>
            <View style={styles.categoryCard}>
              <Pressable style={styles.image} onPress={() => nav(obj)}>
                <Image source={{ uri: obj.image }} style={styles.image} />
              </Pressable>
              <View style={styles.categoryBox}>
                <Pressable onPress={() => nav(obj)} style={{ width: "80%" }}>
                  <Text style={styles.categoryText}>{obj.name}</Text>
                  <Text style={styles.price}>Starts from ₹{obj?.price}</Text>
                  <Text style={styles.des}>
                    {obj.description?.length > 30
                      ? `${obj.description?.slice(0, 40)}...`
                      : obj.description}
                  </Text>
                </Pressable>
                <TouchableOpacity onPress={() => addToCart(obj)}>
                  <Text style={styles.add}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primaryBg,
    paddingHorizontal: 24,
  },
  imageContainer: {
    backgroundColor: "white",
    flex: 10,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  emptyIllustration: {
    width: "100%",
    height: 300,
  },
  categoryCard: {
    width: utils.fullwidth - 24,
    height: 300,
    backgroundColor: Colors.primaryBg,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    borderRadius: 12,
    marginBottom: 16,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "800",
  },
  des: { color: Colors.medium, fontSize: 14, fontWeight: "500" },
  price: { fontSize: 14, fontWeight: "500", paddingVertical: 4 },
  image: {
    flex: 5,
    width: "100%",
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  categoryBox: {
    flex: 2,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
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
