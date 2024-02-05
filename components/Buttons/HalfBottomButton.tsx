import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import utils, { Icon } from "@/constants/utils";
import { Link } from "expo-router";

export default function HalfBottomButton(props: any) {
  const { title, handleClick, iconName, nav, orderTotal, width, data } = props;
  return (
    <View style={styles.bottomButtonContainer}>
      {nav ? (
        <Link
          style={{ ...styles.logoutButtonNav, width }}
          href={{
            pathname: nav,
            params: { orderTotal, data: JSON.stringify(data) },
          }}>
          <View style={styles.logoutButtonContentNav}>
            {iconName && <Icon name={iconName} size={26} color={"white"} />}
            <Text style={styles.logoutButtonTextnav}>{title}</Text>
          </View>
        </Link>
      ) : (
        <TouchableOpacity
          style={{ ...styles.logoutButton, width }}
          onPress={handleClick}>
          <View style={styles.logoutButtonContent}>
            {iconName && <Icon name={iconName} size={26} color={"white"} />}
            <Text style={styles.logoutButtonText}>{title}</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomButtonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 15,
    backgroundColor: Colors.primaryBg,
  },
  logoutButton: {
    backgroundColor: Colors.primary,
    // width: "50%",
    padding: 15,
    alignItems: "center",
    borderRadius: 100,
  },
  logoutButtonNav: {
    backgroundColor: Colors.primary,
    padding: 15,
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 100,
  },
  logoutButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutButtonContentNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  logoutButtonTextnav: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "right",
    width: utils.fullwidth / 3.4,
  },
});
