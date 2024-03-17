import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Linking,
} from "react-native";

import React from "react";
import utils from "@/constants/utils";

import Colors from "@/constants/Colors";
import { useNavigation } from "expo-router";

import { RefreshControl } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function favourites(props: any) {
  const { orders, refetch } = props;

  return (
    <View>
      {orders?.length > 0 ? (
        <MenuCards data={orders} refetch={refetch} />
      ) : (
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.emptyIllustration}
              source={require("@/assets/images/deliveryboy.png")}
              resizeMode="contain"
            />
            <Text
              style={{
                marginTop: 12,
                fontSize: 18,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              No Orders Found
            </Text>
            <TouchableOpacity
              onPress={() => {
                refetch();
              }}
            >
              <Text
                style={{
                  ...styles.payment,
                  color: Colors.primary,
                  marginTop: 24,
                  paddingHorizontal: 24,
                  borderColor: Colors.primary,
                }}
              >
                Refresh
              </Text>
            </TouchableOpacity>
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
    navigation.navigate("details", { data });
    navigation.canGoBack(true);
  }
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const openDirectionsInGoogleMaps = (latitude: any, longitude: any) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Cannot open Google Maps");
      }
    });
  };

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
      }
    >
      {data.map((obj: any, index: any) => (
        <View key={index}>
          <Pressable style={styles.categoryCard}>
            <Pressable style={styles.categoryBox} onPress={() => nav(obj)}>
              <Pressable onPress={() => nav(obj)}>
                <View style={styles.textContainer}>
                  <Text style={styles.categoryText}>ID:</Text>
                  <Text style={{ ...styles.price, marginLeft: 6 }}>
                    #000{obj.id}
                  </Text>
                </View>

                <View style={styles.textContainer}>
                  <Text style={styles.categoryText}>Items:</Text>
                  <Text style={{ ...styles.price, marginLeft: 6 }}>
                    {obj?.Items?.length}
                  </Text>
                </View>

                <View style={styles.textContainer}>
                  <Text style={styles.categoryText}>Total:</Text>
                  <Text style={{ ...styles.price, marginLeft: 6 }}>
                    ₹{obj.bill_total}
                  </Text>
                </View>
              </Pressable>

              <TouchableOpacity onPress={() => nav(obj)}>
                <Text
                  style={{
                    ...styles.payment,
                    color: obj.payment_type == "online" ? "green" : "red",
                    borderColor: obj.payment_type == "online" ? "green" : "red",
                  }}
                >
                  {obj.payment_type == "online" ? "Online" : "COD"}
                </Text>
              </TouchableOpacity>
            </Pressable>
            <Pressable style={styles.textContainer} onPress={() => nav(obj)}>
              <Text style={styles.categoryText}>To:</Text>
              <Text style={{ ...styles.price, marginLeft: 6 }}>
                {obj?.address.house_no}, {obj?.address.street_address},{" "}
                {obj?.address.area}, {obj?.address.landmark},{" "}
                {obj?.address.city},{obj?.address.state}-{obj?.address.pincode}.
              </Text>
            </Pressable>
            <View style={styles.secondCard}>
              <View style={{ width: "40%" }}>
                <TouchableOpacity
                  onPress={() =>
                    openDirectionsInGoogleMaps(
                      obj?.address?.lat,
                      obj?.address?.lon
                    )
                  }
                  style={styles.btnmain}
                >
                  <Text style={styles.add}>Location</Text>
                </TouchableOpacity>
              </View>
              <View />
            </View>
          </Pressable>
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
    marginHorizontal: 24,
    height: utils.fullheight / 1.5,
  },
  imageContainer: {
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyIllustration: {
    height: 300,
  },
  categoryCard: {
    width: utils.fullwidth - 24,
    backgroundColor: Colors.primaryBg,
    elevation: 1,
    padding: 12,
    borderColor: "#E5E5E5",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 24,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "800",
  },
  price: { fontSize: 16, fontWeight: "500" },
  categoryBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  secondCard: {
    marginTop: 12,
    justifyContent: "space-between",
  },
  add: {
    fontSize: 16,
    padding: 8,
    paddingHorizontal: 16,
    color: "white",
    fontWeight: "800",
    textAlign: "center",
  },
  textContainer: { flexDirection: "row", marginBottom: 4 },
  btnmain: {
    backgroundColor: Colors.primary,
    borderRadius: 100,
  },
  payment: {
    fontSize: 16,
    padding: 6,
    paddingHorizontal: 20,
    color: "red",
    fontWeight: "800",
    textAlign: "center",
    borderRadius: 20,
    borderWidth: 1,
  },
});
