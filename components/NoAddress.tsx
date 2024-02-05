import React from "react";
import Colors from "@/constants/Colors";

import { useNavigation } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";

import { View, Text, StyleSheet, Image, SafeAreaView } from "react-native";

const NoAddress = () => {
  const navigation = useNavigation();

  function goToAdrress() {
    navigation.navigate("address");
    navigation.canGoBack(true);
  }

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Image
        style={styles.emptyIllustration}
        source={{
          uri: "https://cdni.iconscout.com/illustration/premium/thumb/no-address-found-4064364-3363925.png?f=webp",
        }}
        resizeMode="contain"
      />
      <Text style={styles.locationServiceText}>Address not provided</Text>

      <TouchableOpacity onPress={goToAdrress}>
        <Text style={styles.locationText}>Add </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyIllustration: {
    width: "100%",
    height: 350,
  },
  logoutButton: {
    backgroundColor: Colors.primaryBg,
    width: "100%",
    padding: 15,
    borderRadius: 100,
    paddingVertical: 12,
    alignItems: "center",
  },
  logoutButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginLeft: 8,
  },

  locationText: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.primary,
    borderColor: Colors.primary,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 45,
    borderRadius: 30,
  },
  locationServiceText: {
    fontSize: 25,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 30,
  },
});

export default NoAddress;
