import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";
import React, { useEffect, useRef } from "react";

import BottomSheet from "./BottomSheet";
import Colors from "../constants/Colors";

import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

import { getRestaurentDetails } from "@/core/services/home";
import { useNavigation } from "expo-router";

const CustomHeader = () => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const restaurent = getRestaurentDetails({});

  const navigation = useNavigation();
  function nav(data: any) {
    navigation.navigate("menus");
    navigation.canGoBack(true);
  }

  useEffect(() => {
    restaurent.refetch();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <BottomSheet ref={bottomSheetRef} />
      <Pressable style={styles.container} onPress={nav}>
        <View style={styles.secondContainer}>
          <Image
            style={styles.bike}
            source={require("@/assets/images/bike.png")}
          />

          <View style={styles.titleContainer}>
            <Text style={styles.title}>Delivery · Now</Text>
            <View style={styles.locationName}>
              <Text style={styles.subtitle}>
                {restaurent?.data?.address?.area || "Select"}
              </Text>
              <Ionicons name="chevron-down" size={20} color={Colors.primary} />
            </View>
          </View>
        </View>
        <Ionicons name="person-outline" size={20} color={Colors.primary} />
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {},
  container: {
    height: 60,
    backgroundColor: Colors.lightGrey,
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  secondContainer: {
    flexDirection: "row",
    backgroundColor: Colors.lightGrey,
    flex: 1,
    alignItems: "center",
  },
  bike: {
    width: 30,
    height: 30,
    marginRight: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    color: Colors.medium,
  },
  locationName: {
    flexDirection: "row",
    alignItems: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  profileButton: {
    backgroundColor: Colors.lightGrey,
    padding: 10,
    borderRadius: 50,
  },
  searchContainer: {
    height: 60,
    backgroundColor: "#fff",
  },
  searchSection: {
    flexDirection: "row",
    gap: 10,
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  searchField: {
    flex: 1,
    backgroundColor: Colors.lightGrey,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    padding: 10,
    color: Colors.mediumDark,
  },
  searchIcon: {
    paddingLeft: 10,
  },
  optionButton: {
    padding: 10,
    borderRadius: 50,
  },
});

export default CustomHeader;
