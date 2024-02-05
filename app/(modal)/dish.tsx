import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ToastAndroid,
} from "react-native";

import React, { useLayoutEffect } from "react";

import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

import useBasketStore from "@/store/basketStore";
import { SafeAreaView } from "react-native-safe-area-context";

import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";

const Dish = () => {
  const router = useRouter();
  const navigation = useNavigation();

  const { addProduct } = useBasketStore();
  const { data } = useLocalSearchParams();

  const items = JSON.parse(data);

  const addToCart = () => {
    addProduct(items);
    ToastAndroid.showWithGravity(
      "Item Added to Cart",
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
    router.back();
  };

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
          {/* <TouchableOpacity style={styles.roundButton}>
            <Ionicons name="share-outline" size={24} color={Colors.primary} />
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.roundButton} onPress={addToCart}>
            <Ionicons name="add-circle" size={26} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, []);
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors.primaryBg }}
      edges={["bottom"]}>
      <View style={styles.container}>
        <Image source={{ uri: items?.image }} style={styles.image} />
        <View style={{ padding: 20 }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={styles.dishName}>{items?.name}</Text>
            <Text style={styles.dishName}>${items?.price}</Text>
          </View>
          <Text style={styles.dishInfo}>{items?.description}</Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.fullButton} onPress={addToCart}>
            <Text style={styles.footerText}>Add for ${items?.price}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBg,
  },
  image: {
    width: "100%",
    height: 300,
  },
  dishName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  dishInfo: {
    fontSize: 16,
    color: Colors.mediumDark,
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
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  footerText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
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
  price: {
    fontSize: 24,
    margin: 16,
    fontWeight: "700",
  },
});

export default Dish;
