import React from "react";
import Colors from "@/constants/Colors";

import { useNavigation } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";

import { View, Text, StyleSheet, Image, SafeAreaView } from "react-native";
import { Icon } from "@/constants/utils";

const NoPincode = (props: any) => {
  const navigation = useNavigation();
  const { area, pin } = props;

  function goToAdrress() {
    navigation.navigate("address");
    navigation.canGoBack(true);
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          marginTop: 4,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <Text
          onPress={goToAdrress}
          style={{
            fontSize: 18,
            textAlign: "center",
            fontWeight: "800",
            color: Colors.primary,
            marginRight: 4,
          }}>
          {area}-{pin}
        </Text>
        <Icon name={"chevron-down"} size={23} color={Colors.primary} />
      </View>
      <View style={styles.container}>
        <Image
          style={styles.emptyIllustration}
          source={{
            uri: "https://cdni.iconscout.com/illustration/premium/thumb/location-map-7504324-6138100.png?f=webp",
          }}
          resizeMode="contain"
        />
        <Text style={styles.locationServiceText}>Location not servicable</Text>
        <View style={{ width: "90%", marginBottom: 15 }}>
          <View style={styles.logoutButton}>
            <View style={styles.logoutButtonContent}>
              <Text style={styles.logoutButtonText}>
                Our team is Working tirelessly to bring our deliveries to your
                location
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={goToAdrress}>
          <Text style={styles.locationText}>Try Changing Location</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 24,
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
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  locationServiceText: {
    fontSize: 25,
    fontWeight: "800",
    textAlign: "center",
    marginVertical: 10,
  },
});

export default NoPincode;
