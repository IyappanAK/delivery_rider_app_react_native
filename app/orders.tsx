import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  Pressable,
  RefreshControl,
} from "react-native";

import moment from "moment";
import Colors from "@/constants/Colors";

import { useNavigation } from "@react-navigation/native";
import { getUserSpecifiedOrders } from "@/core/services/home";

import Loading from "@/components/Pages/Loading";

export default function OrderHistory() {
  const navigation = useNavigation();
  let fullwidth = Dimensions.get("window").width;

  const [currentPage, setCurrentPage] = useState(1);
  const userOrders = getUserSpecifiedOrders(
    { queryKey: [currentPage] },
    currentPage
  );

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    userOrders.refetch();
  }, []);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    userOrders.refetch();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.primaryBg,
      }}
    >
      {userOrders.isLoading ? (
        <Loading />
      ) : (
        <>
          {userOrders?.data?.orders?.length <= 0 ? (
            <EmptyIllustration />
          ) : (
            <ScrollView
              style={styles.container}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              <>
                {userOrders?.data?.orders?.map((item, i) => {
                  const indianDateTime = moment
                    .utc(item?.created_at)
                    .utcOffset("+05:30");
                  const date = indianDateTime.format("DD-MM-YYYY");
                  const time = indianDateTime.format("hh:mm A");
                  return (
                    <View style={{ paddingVertical: 0 }} key={i}>
                      <View
                        style={{
                          ...styles.orderContainer,
                          width: fullwidth - 20,
                        }}
                      >
                        <View style={styles.flex}>
                          <Text style={styles.title}>
                            {item?.Items.length > 1
                              ? `${item?.Items?.[0]?.name} + ${
                                  item?.Items.length - 1
                                } Items`
                              : item?.Items?.[0]?.name}
                          </Text>
                          <Text style={styles.title}> ₹{item?.bill_total}</Text>
                        </View>

                        <View style={{ ...styles.flex, paddingTop: 6 }}>
                          <View>
                            <Text
                              style={{
                                fontSize: 14,
                                fontWeight: "700",
                                color: "#666",
                              }}
                            >
                              Order ID - #000{item?.id}
                            </Text>
                            <Text
                              style={{
                                fontSize: 14,
                                fontWeight: "700",
                                color: "#666",
                              }}
                            >
                              {date} at {time}
                            </Text>
                          </View>
                          <Text
                            style={{
                              ...styles.tag,
                              backgroundColor:
                                item.orderStatus == "delivered"
                                  ? Colors.green
                                  : item.orderStatus == "cancelled"
                                  ? "red"
                                  : Colors.pending,
                            }}
                          >
                            {item?.orderStatus == "new"
                              ? "Pending"
                              : item?.orderStatus == "picked"
                              ? "On the way"
                              : item?.orderStatus.charAt(0).toUpperCase() +
                                item?.orderStatus.slice(1)}
                          </Text>
                        </View>

                        <View style={styles.buttonContainer}>
                          {item.orderStatus && (
                            <View
                              style={{
                                width: "100%",
                                height: 42,
                                ...styles.button,
                              }}
                            >
                              <Pressable
                                onPress={() => {
                                  navigation.navigate("trackOrder", {
                                    data: JSON.stringify(item),
                                  });
                                  navigation.canGoBack(true);
                                }}
                                style={styles.link}
                              >
                                <Text
                                  style={{
                                    ...styles.buttonText,
                                    color:
                                      item.payment_type == "cod"
                                        ? "red"
                                        : "#60B246",
                                  }}
                                >
                                  {item?.payment_type &&
                                    item?.payment_type.toUpperCase()}
                                </Text>
                              </Pressable>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  );
                })}
              </>
              <View style={styles.paginationContainer}>
                <Pressable
                  style={() => [
                    styles.paginationButton,
                    {
                      backgroundColor:
                        currentPage === 1 ? "#B3B3B3" : "#007BFF",
                    },
                  ]}
                  onPress={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  <Text style={styles.paginationButtonText}>Prev</Text>
                </Pressable>
                <Text style={styles.currentPageText}>{currentPage}</Text>
                <Pressable
                  style={() => [
                    styles.paginationButton,
                    {
                      backgroundColor: !userOrders.data?.hasNextPage
                        ? "#B3B3B3"
                        : "#007BFF",
                    },
                  ]}
                  onPress={handleNextPage}
                  disabled={!userOrders.data?.hasNextPage}
                >
                  <Text style={styles.paginationButtonText}>Next</Text>
                </Pressable>
              </View>
            </ScrollView>
          )}
        </>
      )}
    </View>
  );
}

function EmptyIllustration() {
  return (
    <>
      <View style={styles.emptyContainer}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.emptyIllustration}
            source={require("@/assets/images/deliveryboy.png")}
            resizeMode="contain"
          />
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            You don't have any order history
          </Text>
        </View>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  emptyContainer: {
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
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.primaryBg,
    marginBottom: 10,
  },
  flex: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderContainer: {
    borderWidth: 1,
    borderColor: "lightgray",
    padding: 15,
    paddingBottom: 20,
    marginBottom: 10,
    borderRadius: 14,
    backgroundColor: "white",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    height: 40,
    alignItems: "center",
  },
  button: {
    borderColor: Colors.medium,
    borderWidth: 1,
    borderRadius: 6,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  link: {
    width: "100%",
    alignItems: "center",
    textAlign: "center",
  },
  buttonText: {
    color: Colors.tranparentButtonColor,
    borderRadius: 5,
    textAlign: "center",
    alignItems: "center",
    fontSize: 15,
    fontWeight: "700",
  },
  price: { fontSize: 14, fontWeight: "600", paddingBottom: 10 },
  tag: {
    margin: 0,
    textAlign: "center",
    padding: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: "white",
    fontWeight: "700",
    overflow: "hidden",
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
  paginationContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  paginationButton: {
    marginHorizontal: 5,
    padding: 10,
    paddingHorizontal: 16,
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
  paginationButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  currentPageText: {
    color: "black",
    fontSize: 16,
    fontWeight: "700",
    marginHorizontal: 8,
  },
});
