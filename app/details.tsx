import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  Linking,
  Alert,
} from "react-native";

import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";

import Colors from "@/constants/Colors";
import useBasketStore from "@/store/basketStore";

import { useNavigation, useRoute } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";

import { queries } from "@/core/constants/queryKeys";

import { SafeAreaView } from "react-native-safe-area-context";
import { updateOrder } from "@/core/services/home";

const Details = () => {
  const route = useRoute();
  const data = route?.params?.data;

  const [error, setError] = useState<any>(false);
  const [cash, setCash] = useState<any>("");

  const [cancel, setCancel] = useState<any>(false);
  const [cancelReason, setCancelReason] = useState<any>("");

  const [isContentVisible, setContentVisible] = useState(false);

  const queryClient = useQueryClient();
  const { addProduct } = useBasketStore();

  const nav = useNavigation();

  const updateOrders = updateOrder({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          queries.home.riderOrder.queryKey,
          queries.home.tripCash.queryKey,
        ],
      });
      ToastAndroid.showWithGravity(
        "Successfully updated",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      nav.goBack();
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

  const makePhoneCall = (number: any) => {
    Linking.openURL(`tel:+91${number}`).catch((err) =>
      console.error("Error in initiating the phone call: ", err)
    );
  };

  const handleCashCollection = (total: any) => {
    const amount = parseFloat(cash);
    if (amount === total) {
      const payload = {
        id: data?.id,
        orderStatus: "delivered",
        payment_status: "true",
      };
      completeOrder(payload, false);
    } else {
      setCash(0);
      setError("Enter Correct Amount");
    }
  };

  const handleCancel = () => {
    setError("");
    if (cancelReason) {
      const payload = {
        id: data?.id,
        reason: cancelReason,
        orderStatus: "cancelled",
      };
      completeOrder(payload, true);
    } else {
      setError("Enter Valid Cancel Reason");
    }
  };

  const completeOrder = (payload: any, cancel: boolean) => {
    Alert.alert(
      "Alert",
      `Are you sure you want to ${cancel ? "cancel" : "complete"} Order`,
      [
        { text: "NO", style: "cancel" },
        { text: "Yes", onPress: () => updateOrders.mutate(payload) },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.primaryBg }}>
      <View style={styles.detailsContainer}>
        {data?.Items?.map((obj: any) => (
          <ShowMenus data={obj} addToCart={addToCart} />
        ))}
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginRight: 12,
          marginTop: 16,
        }}
      >
        <View style={{ width: "30%" }} />
        <View
          style={{
            width: "70%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.total}>Total Amount + Charges:</Text>
          <Text style={styles.totalText}>₹{data?.bill_total}</Text>
        </View>
      </View>

      <Drawer
        isContentVisible={isContentVisible}
        setContentVisible={setContentVisible}
        setCancel={setCancel}
      />
      {isContentVisible && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginHorizontal: 12,
            marginTop: 24,
          }}
        >
          <TouchableOpacity onPress={() => makePhoneCall(data?.user_number)}>
            <Text
              style={{
                ...styles.payment,
                color: Colors.primary,
                borderColor: Colors.primary,
                marginRight: 24,
              }}
            >
              Contact Customer
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCancel(true)}>
            <Text
              style={{
                ...styles.payment,
                borderColor: "red",
              }}
            >
              Cancel Order
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.footer}>
        <SafeAreaView edges={["bottom"]} style={{ backgroundColor: "#fff" }}>
          {cancel ? (
            <>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextInput
                  style={{
                    ...styles.input,
                    borderColor: cancel ? "red" : "black",
                  }}
                  placeholder="Enter Cancel Reason"
                  value={cancelReason}
                  onChangeText={(text: any) => {
                    setError("");
                    setCancelReason(text);
                  }}
                />
                <TouchableOpacity
                  style={styles.fullButton}
                  onPress={handleCancel}
                >
                  <Text style={styles.footerText}>Cancel Order</Text>
                </TouchableOpacity>
              </View>
              {error && <Text style={styles.errorText}>{error}</Text>}
            </>
          ) : (
            <>
              {data?.payment_type === "online" ? (
                <View>
                  <TouchableOpacity
                    style={styles.fullButton}
                    onPress={() =>
                      completeOrder(
                        {
                          id: data?.id,
                          orderStatus: "delivered",
                        },
                        false
                      )
                    }
                  >
                    <Text style={styles.footerText}>Complete Order</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextInput
                    style={styles.input}
                    placeholder="Cash In Hand"
                    value={cash}
                    keyboardType="numeric"
                    onChangeText={(text: any) => {
                      setError("");
                      setCash(text);
                    }}
                  />
                  <TouchableOpacity
                    style={styles.fullButton}
                    onPress={() => handleCashCollection(data?.bill_total)}
                  >
                    <Text style={styles.footerText}>Collected</Text>
                  </TouchableOpacity>
                </View>
              )}
              {error && <Text style={styles.errorText}>{error}</Text>}
            </>
          )}
        </SafeAreaView>
      </View>
    </View>
  );
};

const ShowMenus = (props: any) => {
  const { data } = props;
  return (
    <View style={styles.item}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={styles.container}>
          <Image source={{ uri: data.image }} style={styles.dishImage} />
        </View>

        <View
          style={{
            width: "70%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text style={styles.dish}>{data.name}</Text>
            <Text style={styles.dishText}>₹{data.price}</Text>
          </View>
          <Text style={styles.qty}>X {data?.quantity}</Text>
        </View>
      </View>
    </View>
  );
};

const Drawer = (props: any) => {
  const { isContentVisible, setContentVisible, setCancel } = props;

  const toggleContent = () => {
    setContentVisible(!isContentVisible);
    setCancel(false);
  };

  return (
    <View style={{ marginHorizontal: 12, marginTop: 20 }}>
      <TouchableOpacity onPress={toggleContent}>
        <View style={styles.headingContainer}>
          <Text style={styles.section}>More</Text>
          <AntDesign
            name={isContentVisible ? "up" : "down"}
            size={18}
            color="#9f9aa1"
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  detailsContainer: {
    backgroundColor: Colors.primaryBg,
  },
  payment: {
    fontSize: 16,
    padding: 8,
    paddingHorizontal: 20,
    color: "red",
    fontWeight: "800",
    textAlign: "center",
    borderRadius: 100,
    borderWidth: 1,
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
    padding: 16,
    flexDirection: "row",
    borderBottomColor: Colors.grey,
    borderBottomWidth: 1,
    justifyContent: "space-between",
  },
  dishImage: {
    height: 70,
    width: 70,
    borderRadius: 4,
  },
  dish: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "left",
  },
  total: {
    fontSize: 18,
    fontWeight: "600",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    backgroundColor: "#60B246",
    paddingHorizontal: 20,
    paddingVertical: 1,
  },
  dishText: {
    fontSize: 15,
    color: Colors.mediumDark,
    paddingVertical: 0,
  },
  qty: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: "700",
    textAlign: "center",
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
    justifyContent: "center",
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
  input: {
    backgroundColor: "white",
    height: 50,
    paddingHorizontal: 10,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 8,
    width: "60%",
    marginRight: 8,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 8,
  },
  headingContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingVertical: 16,
  },
  section: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 12,
  },
});

export default Details;
