import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  ToastAndroid,
  Alert,
} from "react-native";

import {
  createAddress,
  getUserInfo,
  updateUserAddress,
} from "@/core/services/home";

import React, { useEffect, useState } from "react";

import { Link } from "expo-router";
import Colors from "@/constants/Colors";

import { Icon } from "@/constants/utils";
import HalfBottomButton from "@/components/Buttons/HalfBottomButton";

import { useQueryClient } from "@tanstack/react-query";
import { queries } from "@/core/constants/queryKeys";

import Loading from "@/components/Pages/Loading";
import useCommonStore from "@/store/commonStore";

export default function AddressForm() {
  const [formData, setFormData] = useState();

  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState(false);

  const user = getUserInfo({});
  const { geoPoint } = useCommonStore();

  const addressMutate = updateUserAddress({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queries.home.userAddress.queryKey,
      });
      ToastAndroid.showWithGravity(
        "Address updated successfully",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    },
    onError: () => {
      ToastAndroid.showWithGravity(
        "Something Went Wrong",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    },
  });

  const newAddress = createAddress({
    onSuccess: (data: any) => {
      setFormData(data);
      queryClient.invalidateQueries({
        queryKey: queries.home.userAddress.queryKey,
      });
      ToastAndroid.showWithGravity(
        "Address added successfully",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    },
    onError: () => {
      ToastAndroid.showWithGravity(
        "Something Went Wrong",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    },
  });

  const handleChange = (key: any, value: any) => {
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  const handleSubmit = () => {
    if (
      !formData?.house_no ||
      !formData?.street_address ||
      !formData?.area ||
      !formData?.landmark ||
      !formData?.city ||
      !formData?.state ||
      !formData?.pincode
    ) {
      ToastAndroid.showWithGravity(
        "Please complete all the necessary fields",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    } else if (!geoPoint.lat && !geoPoint.lon) {
      Alert.alert(
        "Alert",
        `Please choose your Geo Location by clicking the "Select on Map"`,
        [{ text: "Ok", style: "cancel" }],
        { cancelable: false }
      );
    } else {
      newAddress.mutate({
        user_id: user?.data?.id,
        address_type: "Home",
        ...geoPoint,
        ...formData,
      });
      setEditMode(false);
    }
  };

  const handleUpdate = () => {
    if (
      !formData?.house_no ||
      !formData?.street_address ||
      !formData?.area ||
      !formData?.landmark ||
      !formData?.city ||
      !formData?.state ||
      !formData?.pincode
    ) {
      ToastAndroid.showWithGravity(
        "Please complete all the necessary fields",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    } else {
      delete formData?.user_id;
      addressMutate.mutate({
        Address: formData,
      });
      setEditMode(false);
    }
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  useEffect(() => {
    if (!formData) setFormData(user?.data?.Address?.[0]);
  }, [user?.data]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.lightGrey }}>
      {user.isLoading ? (
        <Loading />
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.currentAddress}>
            {editMode ? "Edit Address" : "Delivery Address"}
          </Text>
          <Text style={styles.currentAddressText}>k
            {user?.data?.Address?.length <= 0 ? (
              editMode ? (
                "Add Your Address"
              ) : (
                "Click Here to Add Your Address 👇"
              )
            ) : (
              <>
                {formData?.house_no}, {formData?.street_address},{" "}
                {formData?.area}, {formData?.landmark}, {formData?.city},
                {formData?.state}-{formData?.pincode}.
                <View style={{ margin: 0 }}>
                  {formData?.alt_number && <Text style={styles.altNumber}>Alternative Number: <Text style={styles.altNumberTwo}>{formData?.alt_number}</Text></Text>}
                </View>
              </>
            )}
          </Text>k
          {editMode && (
            <View style={styles.formGroup}>
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>House No:</Text>
                <TextInput
                  style={styles.input}
                  value={formData?.house_no || ""}
                  onChangeText={(text) => handleChange("house_no", text)}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Street:</Text>
                <TextInput
                  style={styles.input}
                  value={formData?.street_address || ""}
                  onChangeText={(text) => handleChange("street_address", text)}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Area:</Text>
                <TextInput
                  style={styles.input}
                  value={formData?.area || ""}
                  onChangeText={(text) => handleChange("area", text)}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Landmark:</Text>
                <TextInput
                  style={styles.input}
                  value={formData?.landmark || ""}
                  onChangeText={(text) => handleChange("landmark", text)}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>City:</Text>
                <TextInput
                  style={styles.input}
                  value={formData?.city || ""}
                  onChangeText={(text) => handleChange("city", text)}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>State:</Text>
                <TextInput
                  style={styles.input}
                  value={formData?.state || ""}
                  onChangeText={(text) => handleChange("state", text)}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Pincode :</Text>
                <TextInput
                  style={styles.input}
                  value={formData?.pincode || ""}
                  onChangeText={(text) => handleChange("pincode", text)}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Alternative Number (optional) :</Text>
                <TextInput
                  style={styles.input}
                  value={formData?.alt_number || ""}
                  onChangeText={(text) => handleChange("alt_number", text)}
                />
              </View>

              {/* GEO LOCATION */}
              <View style={styles.formGroup}>
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}>
                  <View>
                    <Text style={{ ...styles.inputLabel, ...styles.geo }}>
                      Geolocation
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      marginTop: 12,
                    }}>
                    <Link<{ pathname: any; params: { id: any } }>
                      href={{
                        pathname: "/(modal)/location-search",
                        params: { id: formData?.id || "" },
                      }}
                      style={styles.selectOnMap}>
                      <View style={{ flexDirection: "row" }}>
                        <Text style={styles.editText}>Select on Map </Text>
                        <Icon
                          name="location"
                          size={20}
                          color={Colors.primary}
                        />
                      </View>
                    </Link>
                  </View>
                </View>
              </View>
            </View>
          )}

          {editMode ? (
            <HalfBottomButton
              title={user?.data?.Address?.length <= 0 ? "Submit" : "Update"}
              handleClick={
                user?.data?.Address?.length <= 0 ? handleSubmit : handleUpdate
              }
              width={"45%"}
            />
          ) : (
            <Pressable style={styles.editButton} onPress={handleEditClick}>
              <Text style={styles.text}>
                <Icon name="create-outline" size={20} />
                {user?.data?.Address?.length < 0 ? "Add" : "Edit"}
              </Text>
            </Pressable>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: Colors.primaryBg,
  },
  currentAddress: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 5,
  },
  currentAddressText: {
    fontSize: 16,
    marginBottom: 12,
  },
  formGroup: {
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    paddingVertical: 12,
    borderRadius: 10,
  },
  inputLabel: {
    color: "#787880",
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 5,
  },
  altNumber: {
    color: "#000000",
    fontSize: 15,
    fontWeight: "500",

  },
  editText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "800",
  },
  editButton: {
    backgroundColor: Colors.primary,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    padding: 5,
  },
  selectOnMap: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 60,
    marginRight: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
  },
  geo: {
    textAlign: "center",
    fontWeight: "800",
    fontSize: 16,
    color: "black",
    marginVertical: 8,
  },
  altNumberTwo: {
    color: "#000000",
    fontSize: 15,
    fontWeight: "400",
  },
});
