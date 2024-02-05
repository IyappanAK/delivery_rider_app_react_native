import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ToastAndroid,
} from "react-native";

import React, { useEffect, useState } from "react";
import { queries } from "@/core/constants/queryKeys";

import { useQueryClient } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";

import { getUserInfo, updateUser } from "@/core/services/home";
import HalfBottomButton from "@/components/Buttons/HalfBottomButton";
import Colors from "@/constants/Colors";

export default function Profile() {
  const [name, setName] = useState<any>("");
  const [email, setEmail] = useState<any>("");

  const queryClient = useQueryClient();
  const user = getUserInfo({});

  const nav = useNavigation();
  const updateUserInfo = updateUser({
    onSuccess: () => {
      user.refetch();
      queryClient.invalidateQueries({
        queryKey: queries.home.userAddress.queryKey,
      });
      ToastAndroid.showWithGravity(
        "Details updated successfully",
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

  const handleSave = () => {
    updateUserInfo.mutate({ name, email });
  };

  useEffect(() => {
    setName(user?.data?.name);
    setEmail(user?.data?.email);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.userProfileContainer}>
        <Image
          source={{
            uri: user?.data?.image,
          }}
          style={styles.userProfileImage}
        />
        <Text style={styles.userProfileText}>{user?.data?.name}</Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.inputLabel}>Full Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} />
      </View>
      <HalfBottomButton title={"Save"} handleClick={handleSave} width={"45%"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.primaryBg,
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
    alignItems: "center",
    padding: 15,
    paddingTop: 0,
    borderRadius: 100,
    backgroundColor: "white",
  },
  userProfileText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  userProfileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
});
