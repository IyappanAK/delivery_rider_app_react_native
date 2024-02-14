import { View, Text, StyleSheet } from "react-native";

import React from "react";
import Colors from "@/constants/Colors";

import { getTripCash } from "@/core/services/home";
import HalfBottomButton from "@/components/Buttons/HalfBottomButton";
import Loading from "@/components/Pages/Loading";

export default function Profile() {
  const tripCash = getTripCash({});

  const handleSave = () => {
    tripCash.refetch();
  };

  return (
    <View
      style={{
        backgroundColor: Colors.primaryBg,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {tripCash.isLoading ? (
        <Loading />
      ) : (
        <View style={styles.container}>
          <View style={styles.userProfileContainer}>
            <Text style={styles.userProfileText}>Pending Trip Cash Amount</Text>
            <Text style={styles.totalText}>₹{tripCash?.data?.trip_cash}</Text>
          </View>
          <HalfBottomButton
            title={"Refresh"}
            handleClick={handleSave}
            width={"63%"}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.primaryBg,
  },
  totalText: {
    fontSize: 20,
    fontWeight: "800",
    color: "white",
    backgroundColor: "#60B246",
    paddingHorizontal: 20,
    paddingVertical: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    paddingVertical: 12,
    borderRadius: 10,
  },
  inputLabel: {
    color: "#9796A1",
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 5,
  },
  userProfileContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    paddingTop: 0,
    borderRadius: 100,
    backgroundColor: "white",
  },
  userProfileText: {
    fontSize: 22,
    color: "black",
    fontWeight: "800",
    marginBottom: 16,
  },
  userProfileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
});
