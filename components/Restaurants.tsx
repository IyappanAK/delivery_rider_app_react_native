import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Pressable,
  ToastAndroid,
} from "react-native";

import React from "react";
import Colors from "../constants/Colors";

import { useNavigation } from "expo-router";
import useBasketStore from "@/store/basketStore";

import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

const Restaurants = (props: any) => {
  const { data } = props;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        padding: 15,
        marginBottom: 16,
      }}
      style={styles.container}>
      <MenuCards data={data} />
    </ScrollView>
  );
};

const MenuCards = (props: any) => {
  const { data } = props;

  const navigation = useNavigation();
  const { addProduct, products } = useBasketStore();

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
    <>
      {data?.map((obj: any, index: any) => (
        <View key={index}>
          <View>
            <View style={styles.categoryCard}>
              <Pressable style={styles.image} onPress={() => nav(obj)}>
                <Image source={{ uri: obj.image }} style={styles.image} />
              </Pressable>
              <View style={styles.categoryBox}>
                <Pressable onPress={() => nav(obj)} style={{ width: "65%" }}>
                  <Text style={styles.categoryText}>{obj.name}</Text>
                  <Text style={styles.price}>Starts from ₹{obj?.price}</Text>
                  <Text style={styles.des}>
                    {obj.description?.length > 40
                      ? `${obj.description?.slice(0, 45)}...`
                      : obj.description}
                  </Text>
                </Pressable>
                {/* {products.length > 0 ? (
                  <View style={styles.addBg}>
                    <Ionicons name="add" color="white" size={25} />
                    <Text style={styles.add}>1 </Text>
                    <Ionicons name="remove" color="white" size={25} />
                  </View>
                ) : ( */}
                <TouchableOpacity
                  onPress={() => addToCart(obj)}
                  style={{ width: "100%" }}>
                  <Text style={styles.add}> Add</Text>
                </TouchableOpacity>
                {/* )} */}
              </View>
            </View>
          </View>
        </View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  categoryCard: {
    width: 300,
    height: 290,
    backgroundColor: "#fff",
    marginRight: 12,
    marginEnd: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    borderRadius: 8,
  },
  categoryText: {
    paddingVertical: 0,
    fontSize: 16,
    fontWeight: "800",
  },
  image: {
    flex: 5,
    width: "100%",
    height: 100,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: Colors.loadingColor,
  },
  categoryBox: {
    flex: 2,
    padding: 10,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  add: {
    fontSize: 16,
    padding: 8,
    color: "white",
    fontWeight: "800",
    borderRadius: 8,
    backgroundColor: Colors.primary,
  },
  addBg: {
    width: "35%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.primary,
    padding: 4,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  des: { color: Colors.medium, fontSize: 14, fontWeight: "500" },
  price: { fontSize: 14, fontWeight: "500", paddingVertical: 4 },
});

export default Restaurants;
