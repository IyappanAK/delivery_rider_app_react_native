import React from "react";
import Colors from "@/constants/Colors";

import { Icon } from "@/constants/utils";
import { SafeAreaView } from "react-native";

import { View, Text, StyleSheet, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const NoNetwork = (props: any) => {
  const { NetInfo, setNetwork } = props;

  function handleClick() {
    NetInfo.fetch().then((state: any) => {
      console.log("Is connected?", state.isConnected);
      setNetwork(state.isConnected);
    });
  }

  return (
    <SafeAreaView style={styles.flex}>
      <View style={styles.container}>
        <Image
          style={styles.emptyIllustration}
          source={require("@/assets/images/no-network.webp")}
          resizeMode="contain"
        />
        <Text
          style={{
            fontSize: 25,
            fontWeight: "700",
            textAlign: "center",
            marginVertical: 10,
          }}
        >
          No Internet Connection!
        </Text>
        <View style={{ width: "90%" }}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleClick}>
            <View style={styles.logoutButtonContent}>
              {/* <Icon name={"reload"} size={18} color={Colors.primary} /> */}
              <Text style={styles.logoutButtonText}>
                Verify Your Connection or Try to Reopen the Application
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyIllustration: {
    width: "100%",
    height: 250,
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
    color: Colors.primary,
  },
  flex: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 24,
  },
});

export default NoNetwork;
