import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import React, { useEffect, useRef } from "react";

import BottomSheet from "./BottomSheet";
import Colors from "../constants/Colors";

import { Ionicons } from "@expo/vector-icons";
import { Link, useNavigation } from "expo-router";

import { getUserInfo } from "@/core/services/home";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

const SearchBar = () => {
  const navigation = useNavigation();
  function nav() {
    navigation.navigate("search-page");
    navigation.canGoBack(true);
  }

  return (
    <TouchableOpacity onPressIn={nav} style={styles.searchContainer}>
      <View style={styles.searchSection}>
        <View style={styles.searchField}>
          <Ionicons
            style={styles.searchIcon}
            name="ios-search"
            size={20}
            color={Colors.medium}
          />
          <TextInput
            style={styles.input}
            placeholder="Discover the dishes you love"
            editable={false}
          />
        </View>
        {/* <Link href={"/(modal)/filter"} asChild>
        <TouchableOpacity style={styles.optionButton}>
          <Ionicons name="options-outline" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </Link> */}
      </View>
    </TouchableOpacity>
  );
};

const CustomHeader = () => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const user = getUserInfo({});

  const openModal = () => {
    bottomSheetRef.current?.present();
  };

  useEffect(() => {
    user.refetch();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <BottomSheet ref={bottomSheetRef} />
      <View style={styles.container}>
        <View style={styles.secondContainer}>
          <TouchableOpacity
            onPress={() => openModal()}
            style={{ marginRight: 16 }}>
            <Link href="/address" style={{ width: 30, height: 50 }}>
              <Image
                style={styles.bike}
                source={require("@/assets/images/bike.png")}
              />
            </Link>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openModal()}>
            <Link href="/address">
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Delivery · Now</Text>
                <View style={styles.locationName}>
                  <Text style={styles.subtitle}>
                    {user?.data?.Address?.[0]?.area || "Select"}{" "}
                  </Text>
                  <Ionicons
                    name="chevron-down"
                    size={20}
                    color={Colors.primary}
                  />
                </View>
              </View>
            </Link>
          </TouchableOpacity>
        </View>
        <Link href={"/menus"} asChild>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-outline" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </Link>
      </View>
      <SearchBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    height: 60,
    backgroundColor: "#fff",
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 40,
  },
  secondContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    flex: 1,
    alignItems: "center",
  },
  bike: {
    width: 30,
    height: 30,
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
