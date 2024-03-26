import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import React, { useEffect, useState } from "react";

import moment from "moment";
import Colors from "@/constants/Colors";

import { AntDesign } from "@expo/vector-icons";
import { FlatList } from "react-native-gesture-handler";

import { useLocalSearchParams } from "expo-router";
import { getOrderById, getRestaurentDetails } from "@/core/services/home";

import HalfBottomButton from "@/components/Buttons/HalfBottomButton";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import { RefreshControl } from "react-native";

const OrderTrackingScreen = () => {
  const { data } = useLocalSearchParams();
  const [step, setStep] = useState<any>(0);

  const items = JSON.parse(data);
  const restaurent = getRestaurentDetails({});

  const order = getOrderById({}, items?.id);
  const item = order?.data;

  const makePhoneCall = () => {
    Linking.openURL(
      `tel:${
        item?.orderStatus == "picked"
          ? item?.rider_number
          : restaurent?.data?.phone_number
      }`
    ).catch((err) =>
      console.error("Error in initiating the phone call: ", err)
    );
  };

  const progressStepsobj = {
    activeStepIconBorderColor:
      item?.orderStatus == "cancelled" ? "red" : Colors.primary,
    activeLabelColor: item?.orderStatus == "cancelled" ? "red" : Colors.primary,
    activeStep: step,
    completedLabelColor: Colors.primary,
    completedStepIconColor: Colors.primary,
    completedProgressBarColor: Colors.primary,
  };

  const orderTime = moment
    .utc(item?.created_at)
    .utcOffset("+05:30")
    .format("MMMM D YYYY hh:mm A");

  useEffect(() => {
    if (item?.orderStatus == "new") {
      setStep(0);
    }
    if (item?.orderStatus == "preparing" || item?.orderStatus == "ready") {
      setStep(1);
    }
    if (item?.orderStatus == "picked") {
      setStep(2);
    }
    if (item?.orderStatus == "delivered" || item?.orderStatus == "cancelled") {
      setStep(3);
    }
  }, [item]);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    order.refetch();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.addressContainer}>
        <Text style={styles.currentAddress}>Delivery Address</Text>
        <Text style={styles.currentAddressText}>
          {item?.address?.house_no}, {item?.address?.street_address},{" "}
          {item?.address?.area}, {item?.address?.landmark},{" "}
          {item?.address?.city}, {item?.address?.state} -{" "}
          {item?.address?.pincode}
        </Text>
      </View>
      <View style={styles.orderStatusContainer}>
        <Text style={{ ...styles.orderStatus, fontWeight: "700" }}>
          Order status :
          <Text style={styles.orderStatusSubText}>
            {" "}
            {item?.orderStatus == "new"
              ? "Pending"
              : item?.orderStatus.charAt(0).toUpperCase() +
                item?.orderStatus.slice(1)}
          </Text>
        </Text>
        {/* <Text style={styles.orderStatus}>
          ETA:
          <Text style={styles.orderStatusSubText}> 25 Min</Text>
        </Text> */}
      </View>
      {/* <View style={{ height: 125 }}>
        <ProgressSteps {...progressStepsobj}>
          <ProgressStep label="Pending" nextBtnText="" previousBtnText="" />
          <ProgressStep
            label={
              item?.orderStatus.charAt(0).toUpperCase() +
              item?.orderStatus.slice(1)
            }
            nextBtnText=""
            previousBtnText=""
          />
          <ProgressStep label="On the way" nextBtnText="" previousBtnText="" />
          <ProgressStep
            label={item?.orderStatus == "cancelled" ? "Cancelled" : "Delivered"}
            previousBtnText=""
            finishBtnText=""
          />
        </ProgressSteps>
      </View> */}

      <View style={styles.orderDetailContainer}>
        <View style={styles.justBetween}>
          <Text style={styles.orderStatus}>Order Id</Text>
          <Text style={styles.orderSubtext}>#000{item?.id}</Text>
        </View>
        <View style={styles.justBetween}>
          <Text style={styles.orderStatus}>Order Date</Text>
          <Text style={styles.orderSubtext}>{orderTime} </Text>
        </View>
        <View style={styles.justBetween}>
          <Text style={styles.orderStatus}>Payment Method</Text>
          <Text style={styles.orderSubtext}>
            {item?.payment_type?.toUpperCase()}
          </Text>
        </View>
        <View style={styles.justBetween}>
          <Text style={styles.orderStatus}>Payment Status</Text>
          <Text style={styles.orderSubtext}>
            {item?.payment_status == "true" ? "Success" : "Not Yet "}
          </Text>
        </View>
        {item?.orderStatus == "cancelled" && (
          <>
            <View style={styles.justBetween}>
              <Text style={styles.orderStatus}>Cancelled Reason:</Text>
              <Text style={styles.orderSubtext}>{!item?.reason && `-`}</Text>
            </View>
            <Text style={{ ...styles.orderSubtext, color: "red" }}>
              {item?.reason && `# ${item?.reason}`}
            </Text>
          </>
        )}
      </View>
      <Drawer item={item} />
      <View style={{ marginVertical: 20 }}>
        <HalfBottomButton
          title={item?.orderStatus == "picked" ? "Contact Rider" : "Contact"}
          handleClick={makePhoneCall}
          width={"45%"}
        />
      </View>
    </ScrollView>
  );
};

const Drawer = ({ item }) => {
  const [isContentVisible, setContentVisible] = useState(false);

  const toggleContent = () => {
    setContentVisible(!isContentVisible);
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleContent}>
        <View style={styles.headingContainer}>
          <Text style={styles.section}>Order Items</Text>
          <AntDesign
            name={isContentVisible ? "close" : "infocirlceo"}
            size={20}
            color="black"
          />
        </View>
      </TouchableOpacity>
      {isContentVisible && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <FlatList
            data={item?.Items}
            style={{
              marginTop: 6,
              borderColor: "#cfcfcf",
              borderWidth: 1,
              borderRadius: 8,
              padding: 4,
            }}
            ItemSeparatorComponent={() => (
              <View style={{ height: 1, backgroundColor: Colors.grey }} />
            )}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Text style={{ color: Colors.primary, fontSize: 18 }}>
                  {item.quantity}x
                </Text>
                <Text style={{ flex: 1, fontSize: 18 }}>{item.name}</Text>
                <Text style={{ fontSize: 18 }}>
                  ₹{item.price * item.quantity}
                </Text>
              </View>
            )}
            ListFooterComponent={
              <View>
                <View
                  style={{ height: 1, backgroundColor: Colors.grey }}
                ></View>
                {/* <View style={styles.totalRow}>
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
                </View> */}

                <View style={styles.totalRow}>
                  <Text style={styles.total}>Total amount + charges</Text>
                  <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                    ₹{item?.bill_total}
                  </Text>
                </View>
              </View>
            }
          />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    backgroundColor: Colors.primaryBg,
    paddingHorizontal: 24,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
  orderContainer: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 16,
    marginBottom: 16,
  },
  addressContainer: {
    borderColor: "#C7C7C9",
    borderBottomWidth: 0.8,
  },
  currentAddress: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 5,
  },
  currentAddressText: {
    fontSize: 16,
    marginBottom: 20,
  },
  orderStatus: {
    fontSize: 16,
    fontWeight: "700",
  },
  orderStatusSubText: {
    fontSize: 16,
    fontWeight: "700",
  },
  orderStatusContainer: {
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fcfcfc",
  },
  orderDetailContainer: {
    borderColor: "#C7C7C9",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    paddingVertical: 20,
  },
  justBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    gap: 20,
    alignItems: "center",
  },
  section: {
    fontSize: 17,
    fontWeight: "bold",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff",
  },
  total: {
    fontSize: 18,
    color: Colors.medium,
  },
  linkFooter: {
    flex: 0.3,
    borderWidth: 5,
    borderRadius: 20,
    width: "100%",
  },

  footerText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  orderSubtext: {
    fontSize: 15,
    fontWeight: "600",
  },
  headingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomColor: "lightgray",
  },
  headingText: {
    fontSize: 18,
  },
  contentContainer: {
    padding: 16,
  },
});

export default OrderTrackingScreen;
