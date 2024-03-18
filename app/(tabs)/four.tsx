import React, { useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Image, Alert } from "react-native";

import HalfBottomButton from "@/components/Buttons/HalfBottomButton";
import Colors from "@/constants/Colors";

import utils, { Icon } from "@/constants/utils";
import { Link, useFocusEffect } from "expo-router";

import * as SecureStore from "expo-secure-store";
import useBasketStore from "@/store/basketStore";

import { getTripCash, getUserInfo } from "@/core/services/home";
import { useQueryClient } from "@tanstack/react-query";

import { AkiImage } from "@/constants/Images";

export default function Menus() {
  const user = getUserInfo({});
  const tripCash = getTripCash({});

  const queryClient = useQueryClient();
  const { clearToken } = useBasketStore();

  const data = [
    {
      title: "My Orders",
      icon: "analytics-sharp",
      nav: "/orders",
      batch: false,
    },
    { title: "Trip Cash", icon: "cash-sharp", nav: "/profile", batch: true },
  ];

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => Logout() },
      ],
      { cancelable: false }
    );
  };

  const Logout = async () => {
    queryClient.invalidateQueries();
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("basket");
    clearToken();
  };

  useEffect(() => {
    user.refetch();
  });

  useFocusEffect(() => {
    tripCash.refetch();
  });

  return (
    <View style={styles.container}>
      <View style={styles.userProfileContainer}>
        <Image
          source={{
            uri: user?.data?.image || AkiImage,
          }}
          style={styles.userProfileImage}
        />
        <Text style={styles.userProfileText}>{user?.data?.name}</Text>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item, index) => item.title + index}
        renderItem={({ item }) => (
          <Link href={item.nav}>
            <View style={styles.menuMain}>
              <View style={styles.menuItem}>
                <Icon name={item.icon} size={24} color={Colors.primary} />
                <Text style={styles.menuText}>{item.title}</Text>
              </View>

              <View style={styles.menuItem}>
                {item.batch && (
                  <Icon
                    name={
                      tripCash?.data?.trip_cash > 0
                        ? "notifications-circle"
                        : ""
                    }
                    size={24}
                    color={"red"}
                  />
                )}
                <Icon
                  name={"chevron-forward"}
                  size={24}
                  color={Colors.primary}
                />
              </View>
            </View>
          </Link>
        )}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
      />
      <HalfBottomButton
        title={" Log-Out"}
        handleClick={handleLogout}
        width={"45%"}
        iconName={"log-out-outline"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  menuMain: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    width: utils.fullwidth,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
  },
  menuText: {
    fontSize: 18,
    fontWeight: "normal",
    color: "black",
    marginLeft: 10,
  },
  divider: {
    backgroundColor: "#EEEEEE",
    height: 1.3,
  },
  userProfileContainer: {
    alignItems: "center",
    padding: 15,
    borderRadius: 100,
    backgroundColor: "white",
  },
  userProfileText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  userProfileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  bottomButtonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 15,
  },
  logoutButton: {
    backgroundColor: Colors.primary,
    width: "50%",
    padding: 15,
    alignItems: "center",
    borderRadius: 100,
  },
  logoutButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  logoutButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
});
