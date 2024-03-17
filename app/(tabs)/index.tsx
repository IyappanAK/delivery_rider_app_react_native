import React, { useEffect } from "react";
import Colors from "@/constants/Colors";

import { getRiderOrders, getUserInfo, updateUser } from "@/core/services/home";
import Loading from "@/components/Pages/Loading";

import { ScrollView, StyleSheet } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import useCommonStore from "@/store/commonStore";

import * as Device from "expo-device";
import { Platform } from "react-native";

import * as Notifications from "expo-notifications";
import CustomHeader from "@/components/CustomHeader";

import Favourites from "@/components/Pages/Favourites";
import { useFocusEffect } from "expo-router";
import { RefreshControl } from "react-native";

const Page = () => {
  const orders = getRiderOrders({}, 8);
  const user = getUserInfo({});

  const [refreshing, setRefreshing] = React.useState(false);
  const { setUserInfo, userInfo } = useCommonStore();

  const dataLoading = orders.isLoading;

  useEffect(() => {
    if (user.data && !userInfo) {
      setUserInfo(user.data);
    }
  }, [user.data]);

  useFocusEffect(() => {
    orders.refetch();
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    orders.refetch();

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const updateUserInfo = updateUser({});

  useEffect(() => {
    console.log("Registering for push notifications...");
    registerForPushNotificationsAsync()
      .then((token) => {
        console.log("token: ", token);
        updateUserInfo.mutate({ pushToken: token });
      })
      .catch((err) => console.log(err));
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: "5a60a5bf-cc35-43b7-8735-ebf36dbb499f",
        })
      ).data;
      console.log(token);
    } else {
      alert("Must use a physical device for Push Notifications");
    }

    return token;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {dataLoading ? (
          <Loading />
        ) : (
          <>
            <CustomHeader />
            <Favourites orders={orders?.data} refetch={orders.refetch} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBg,
  },
  scrollView: {
    flex: 1,
  },
});

export default Page;
