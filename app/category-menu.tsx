import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  ToastAndroid,
} from "react-native";
import React, { useEffect, useLayoutEffect } from "react";

import Colors from "@/constants/Colors";
import utils from "@/constants/utils";

import { useNavigation } from "expo-router";
import HalfBottomButton from "@/components/Buttons/HalfBottomButton";

import { getCatMenus } from "@/core/services/home";
import { useRoute } from "@react-navigation/native";

import Loading from "@/components/Pages/Loading";
import useBasketStore from "@/store/basketStore";

import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CatMenu() {
  const route = useRoute();
  const navigation = useNavigation();

  const { items, total, products } = useBasketStore();
  const menus = getCatMenus({ enabled: false, retry: false }, route.params.id);

  const FEES = {
    service: 10,
    delivery: 10,
  };

  function nav() {
    navigation.goBack();
  }

  function basketNav() {
    navigation.navigate("basket");
    navigation.canGoBack(true);
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `${route.params.name}`,
    });
  }, [route.params]);

  useEffect(() => {
    if (route.params.id) {
      menus.refetch();
    }
  }, [route.params.id]);

  return (
    <>
      {menus.isLoading ? (
        <View style={{ backgroundColor: Colors.lightGrey, flex: 1 }}>
          <Loading />
        </View>
      ) : (
        <>
          {menus?.data?.length > 0 && menus.isSuccess ? (
            <MenuCards data={menus.data} />
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
          {products?.length > 0 && (
            <View style={styles.footer}>
              <SafeAreaView
                edges={["bottom"]}
                style={{ backgroundColor: "#fff" }}>
                <TouchableOpacity
                  style={styles.fullButton}
                  onPress={() => basketNav()}>
                  <Text style={styles.basket}>{products.length} Qty</Text>
                  <Text style={styles.footerText}>View Basket</Text>
                  <Text style={styles.basketTotal}>
                    ₹{(total + FEES.service + FEES.delivery)?.toFixed(2)}
                  </Text>
                </TouchableOpacity>
              </SafeAreaView>
            </View>
          )}
        </>
      )}
    </>
  );
}

const MenuCards = (props: any) => {
  const { data } = props;

  const navigation = useNavigation();
  const { addProduct } = useBasketStore();

  function nav(data: any) {
    navigation.navigate("details", { data });
    navigation.canGoBack(true);
  }

  const addToCart = (data: any) => {
    addProduct(data);
    ToastAndroid.showWithGravity(
      "Item Added to Cart",
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
  };
  return (
    <View style={{backgroundColor:Colors.primaryBg,flex:1}}>
    <ScrollView
      showsVerticalScrollIndicator={true}
      contentContainerStyle={{
        paddingVertical: 24,
        alignItems: "center",
        backgroundColor: Colors.primaryBg,
      }}>
      {data?.map((obj: any, index: any) => (
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
      <View style={{ height: 66 }} />
    </ScrollView>
    </View>
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
    backgroundColor: "#fff",
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
});
