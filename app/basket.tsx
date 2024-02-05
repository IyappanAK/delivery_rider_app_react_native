import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
  Alert,
  ToastAndroid,
} from "react-native";

import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";

import Colors from "@/constants/Colors";
import useBasketStore from "@/store/basketStore";

import { Ionicons } from "@expo/vector-icons";
import { queries } from "@/core/constants/queryKeys";

import { Icon } from "@/constants/utils";
import NoPincode from "@/components/NoPincode";

import { useQueryClient } from "@tanstack/react-query";
import HalfBottomButton from "@/components/Buttons/HalfBottomButton";

import { getPincodes, getUserInfo, postOrder } from "@/core/services/home";
import NoAddress from "@/components/NoAddress";
import Loading from "@/components/Pages/Loading";

const Basket = () => {
  const userInfo = getUserInfo({});
  const pincode = getPincodes({});

  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const { clearCart } = useBasketStore();

  const [selectedTab, setSelectedTab] = useState("COD");
  const [locationCheck, setLocationCheck] = useState(false);

  const { products, total, reduceProduct, addProduct } = useBasketStore();

  const FEES = {
    service: 10,
    delivery: 10,
  };

  const orderDetails: any = {
    orderStatus: "new",
    customer_name: userInfo?.data?.name,
    bill_total: Number(Math.ceil(total + FEES.service + FEES.delivery)),
    user_id: userInfo?.data?.id,
    user_number: userInfo?.data?.phone_number,
    address: userInfo?.data?.Address?.[0],
    Items: products,
    payment_type: selectedTab.toLowerCase(),
    payment_status: "false",
  };

  const postNewOrder = postOrder({
    onSuccess: () => {
      ToastAndroid.showWithGravity(
        "Order Placed Successfully",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      queryClient.invalidateQueries({
        queryKey: queries.home.userOrders.queryKey,
      });

      navigation.navigate("orders");
      navigation.canGoBack(true);
      clearCart();
    },

    onError: () => {
      ToastAndroid.showWithGravity(
        "Something Went Wrong",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      queryClient.invalidateQueries({
        queryKey: queries.home.userOrders.queryKey,
      });
    },
  });

  function alertAddress() {
    Alert.alert(
      "Add Address",
      "You have to add your address to continue !",
      [
        { text: "Later", style: "cancel" },
        { text: "Add Now", onPress: () => goToAdrress() },
      ],
      { cancelable: false }
    );
  }

  function orderWithCOD() {
    Alert.alert(
      "Alert",
      "Are you sure you want to place the order ?",
      [
        { text: "Later", style: "cancel" },
        { text: "Add Now", onPress: () => postNewOrder.mutate(orderDetails) },
      ],
      { cancelable: false }
    );
  }

  function goToAdrress() {
    navigation.navigate("address");
    navigation.canGoBack(true);
  }

  function nav() {
    navigation.goBack();
  }

  useEffect(() => {
    const loc = pincode?.data?.some(
      (obj) => obj.code == userInfo?.data?.Address?.[0]?.pincode
    );

    navigation.setOptions({
      headerTitle: `Cart`,
    });

    if (userInfo.data && pincode.data) {
      setLocationCheck(loc);
      if (!loc) {
        navigation.setOptions({
          headerTitle: ``,
        });
      }
    }
  }, [userInfo.data, pincode.data]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPincode = async () => {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    };
    checkPincode();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.primaryBg }}>
      {
        loading ? <Loading /> :
          <View style={{ flex: 1, backgroundColor: Colors.primaryBg }}>
            {userInfo?.data?.Address?.length <= 0 ? (
              <NoAddress />
            ) : (
              <>
                {locationCheck ? (
                  <>
                    {products.length > 0 ? (
                      <FlatList
                        style={{ backgroundColor: "white" }}
                        data={products}
                        ListHeaderComponent={
                          <View
                            style={{
                              ...styles.flex,
                              ...styles.section,
                              marginHorizontal: 8,
                            }}>
                            <Text style={styles.items}>Items</Text>
                          </View>
                        }
                        ItemSeparatorComponent={() => (
                          <View
                            style={{
                              height: 1,
                              backgroundColor: Colors.grey,
                            }}
                          />
                        )}
                        renderItem={({ item }) => (
                          <View>
                            <View style={styles.row}>
                              <Text
                                style={{
                                  width: "60%",
                                  fontSize: 18,
                                  fontWeight: "700",
                                }}>
                                {item.name}
                              </Text>
                              <View
                                style={{
                                  flexDirection: "row",
                                  width: "40%",
                                  paddingRight: 10,
                                  justifyContent: "space-between",
                                }}>
                                <>
                                  <Ionicons
                                    name="remove"
                                    color="#bebfc5"
                                    size={22}
                                    onPress={() => reduceProduct(item)}
                                  />
                                  <Text style={styles.quantity}>{item.quantity}</Text>
                                  <Ionicons
                                    name="add"
                                    color="#60B246"
                                    size={22}
                                    onPress={() => addProduct(item)}
                                  />
                                </>
                                <Text style={{ fontSize: 18, fontWeight: "600" }}>
                                  ₹{item.price * item.quantity}
                                </Text>
                              </View>
                            </View>
                          </View>
                        )}
                        ListFooterComponent={
                          <View style={{ marginHorizontal: 8 }}>
                            <View
                              style={{
                                height: 1,
                                backgroundColor: Colors.grey,
                              }}></View>
                            <View style={{ ...styles.totalRow, marginTop: 16 }}>
                              <Text style={styles.total}>Subtotal</Text>
                              <Text style={{ fontSize: 18 }}>₹{total}</Text>
                            </View>
                            <View style={styles.totalRow}>
                              <Text style={styles.total}>Service fee</Text>
                              <Text style={{ fontSize: 18 }}>₹{FEES.service}</Text>
                            </View>

                            <View style={styles.totalRow}>
                              <Text style={styles.total}>Delivery fee</Text>
                              <Text style={{ fontSize: 18 }}>₹{FEES.delivery}</Text>
                            </View>

                            <View style={styles.totalRow}>
                              <Text style={{ ...styles.total, fontWeight: "800" }}>
                                Order Total
                              </Text>
                              <Text style={styles.totalText}>
                                ₹{(total + FEES.service + FEES.delivery)?.toFixed(2)}
                              </Text>
                            </View>
                            <View style={styles.totalRow}>
                              <Text style={{ ...styles.total, fontWeight: "700" }}>
                                Payment Method
                              </Text>
                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  width: "40%",
                                  borderColor: Colors.medium,
                                  borderWidth: 1,
                                  padding: 0.8,
                                  borderRadius: 2,
                                  marginTop: 8,
                                }}>
                                <TouchableOpacity
                                  onPress={() => setSelectedTab("COD")}
                                  style={{
                                    width: "50%",
                                    alignItems: "center",
                                    backgroundColor:
                                      selectedTab === "COD"
                                        ? Colors.primary
                                        : "white",
                                    borderRadius: 2,
                                  }}>
                                  <Text
                                    style={{
                                      fontSize: 17,
                                      color:
                                        selectedTab === "COD" ? "white" : "black",
                                      fontWeight: "800",
                                    }}>
                                    COD
                                  </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => setSelectedTab("Online")}
                                  style={{
                                    width: "50%",
                                    alignItems: "center",
                                    backgroundColor:
                                      selectedTab === "Online"
                                        ? Colors.primary
                                        : "white",
                                  }}>
                                  <Text
                                    style={{
                                      fontSize: 17,
                                      color:
                                        selectedTab === "Online" ? "white" : "black",
                                      fontWeight: "800",
                                    }}>
                                    Online
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                            <Pressable
                              style={{ paddingHorizontal: 10 }}
                              onPress={goToAdrress}>
                              <Text style={styles.currentAddress}>
                                Delivery Address :
                              </Text>
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "flex-start",
                                  justifyContent: "space-between",
                                }}>
                                <Text style={styles.currentAddressText}>
                                  {userInfo?.data?.Address?.length <= 0 ? (
                                    "Clikc Add to Add Your Address  👉"
                                  ) : (
                                    <>

                                      {userInfo?.data?.Address?.[0]?.house_no},{" "}
                                      {userInfo?.data?.Address?.[0]?.street_address},{" "}
                                      {userInfo?.data?.Address?.[0]?.area},{" "}
                                      {userInfo?.data?.Address?.[0]?.landmark},{" "}
                                      {userInfo?.data?.Address?.[0]?.city},{" "}
                                      {userInfo?.data?.Address?.[0]?.state}-{" "}
                                      {userInfo?.data?.Address?.[0]?.pincode}
                                      <View>
                                        {userInfo?.data?.Address?.[0]?.alt_number && <Text style={styles.altNumber}>Alternative Number: <Text style={styles.altNumberTwo}>+91{userInfo?.data?.Address?.[0]?.alt_number}</Text></Text>}
                                      </View>
                                    </>
                                  )}
                                </Text>

                                <Pressable
                                  style={styles.editButton}
                                  onPress={goToAdrress}>
                                  <Text style={styles.text}>
                                    <Icon name="create-outline" size={22} />
                                  </Text>
                                </Pressable>
                              </View>
                            </Pressable>
                          </View>
                        }
                      />
                    ) : (
                      <View style={styles.imageContainer}>
                        <Image
                          style={styles.emptyIllustration}
                          source={require("@/assets/images/empty-basket.png")}
                          resizeMode="contain"
                        />
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: "bold",
                            textAlign: "center",
                            marginTop: 20,
                          }}>
                          Basket is Empty
                        </Text>
                      </View>
                    )}
                    {products.length > 0 ? (
                      <>
                        {userInfo?.data?.Address?.length <= 0 ? (
                          <HalfBottomButton
                            title="Order Now"
                            handleClick={alertAddress}
                            width={"45%"}
                          />
                        ) : (
                          <HalfBottomButton
                            title={"Order Now"}
                            nav={selectedTab == "Online" && "/razorpay"}
                            handleClick={orderWithCOD}
                            data={orderDetails}
                            orderTotal={(
                              total +
                              FEES.service +
                              FEES.delivery
                            ).toFixed(2)}
                            width={"50%"}
                          />
                        )}
                      </>
                    ) : (
                      <HalfBottomButton
                        title="Order Now"
                        handleClick={nav}
                        width={"45%"}
                      />
                    )}
                  </>
                ) : (
                  <NoPincode
                    pin={userInfo?.data?.Address?.[0]?.pincode}
                    area={userInfo?.data?.Address?.[0]?.area}
                  />
                )}
              </>
            )}
          </View>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quantity: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: "800",
  },
  items: { fontSize: 20, fontWeight: "bold" },
  imageContainer: {
    backgroundColor: Colors.primaryBg,
    flex: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    backgroundColor: Colors.primary,
    width: "10%",
    borderRadius: 4,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    padding: 5,
  },
  emptyIllustration: {
    width: 300,
    height: 300,
  },
  currentAddress: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 5,
    marginTop: 8,
  },
  currentAddressText: {
    fontSize: 16,
    width: "75%",
  },
  paymentBtn: {
    flex: 0.15,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    margin: 16,
    borderRadius: 10,
  },
  row: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 10,
    gap: 20,
    alignItems: "center",
    marginHorizontal: 8,
  },
  section: {
    marginBottom: 16,
    padding: 10,
    backgroundColor: Colors.lightGrey,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
  },
  total: {
    fontSize: 18,
    flex: 1,
  },
  linkFooter: {
    flex: 0.3,
    borderWidth: 5,
    borderRadius: 20,
    width: "100%",
  },
  footer: {
    position: "absolute",
    backgroundColor: "white",
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
    flex: 0.3,
    borderWidth: 5,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  footerText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  orderBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    width: 250,
    height: 50,
    justifyContent: "center",
    marginTop: 20,
  },
  totalText: {
    fontSize: 18,
    color: "white",
    fontWeight: "800",
    backgroundColor: "#60B246",
    paddingHorizontal: 20,
    paddingVertical: 1,
  },
  altNumber: {
    color: "#000000",
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 5,
  },
  altNumberTwo: {
    color: "#000000",
    fontSize: 15,
    fontWeight: "400",
    marginBottom: 5,
  },
});

export default Basket;
