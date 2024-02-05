import Colors from "@/constants/Colors";
import * as Location from "expo-location";

import { useLocalSearchParams, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import React, { useEffect, useRef, useState } from "react";
import MapView, { Callout, Marker } from "react-native-maps";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
  Image,
} from "react-native";

import { queries } from "@/core/constants/queryKeys";
import { getUserInfo, updateUserAddress } from "@/core/services/home";

import { useQueryClient } from "@tanstack/react-query";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import useCommonStore from "@/store/commonStore";

const LocationSearch = () => {
  const navigation = useNavigation();
  const [location, setLocation] = useState<any>({
    latitude: 13.0832,
    longitude: 80.2755,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });

  const [loading, setLoading] = useState<any>(false);
  const { id } = useLocalSearchParams();

  const queryClient = useQueryClient();
  const user = getUserInfo({});

  const { setGeoPoint, geoPoint } = useCommonStore();

  const addressMutate = updateUserAddress({
    onSuccess: (data: any) => {
      setGeoPoint({
        lat: Number(data?.Address?.[0]?.lat),
        lon: Number(data?.Address?.[0]?.lon),
      });

      queryClient.invalidateQueries({
        queryKey: queries.home.userAddress.queryKey,
      });

      ToastAndroid.showWithGravity(
        "Geo location updated successfully",
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

  const fetchGeoData = async (latitude: any, longitude: any) => {
    setLocation({
      latitude,
      longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    });
    setLoading(false);
  };

  useEffect(() => {
    const getLocation = async () => {
      setLoading(true);
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          ToastAndroid.showWithGravity(
            "Location Permission has been Declined !",
            ToastAndroid.SHORT,
            ToastAndroid.CENTER
          );
          navigation.goBack();
        }

        if (geoPoint.lat) {
          fetchGeoData(Number(geoPoint.lat), Number(geoPoint.lon));
        } else {
          let location = await Location.getCurrentPositionAsync({});
          fetchGeoData(location.coords.latitude, location.coords.longitude);
        }
      } catch (error) {
        setLoading(true);
        ToastAndroid.showWithGravity(
          "Location Permission Has Been Declined !",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
        navigation.goBack();
        // console.error("Error requesting location permission:", error);
      }
    };
    getLocation();
  }, [geoPoint]);

  useEffect(() => {
    if (user?.data?.Address?.[0]?.lat && user?.data?.Address?.[0]?.lon) {
      setGeoPoint({
        lat: Number(user?.data?.Address?.[0]?.lat),
        lon: Number(user?.data?.Address?.[0]?.lon),
      });
    }
  }, [user?.data]);

  const markerRef = useRef(null);

  const onRegionChangeComplete = () => {
    if (markerRef && markerRef.current && markerRef.current.showCallout) {
      markerRef.current.showCallout();
    }
  };

  function onPressConfirm() {
    if (id) {
      addressMutate.mutate({
        Address: {
          id: Number(id),
          lat: location.latitude.toString(),
          lon: location.longitude.toString(),
        },
      });
    } else {
      setGeoPoint({
        lat: location.latitude.toString(),
        lon: location.longitude.toString(),
      });
    }
    navigation.goBack();
  }

  return (
    <View style={{ flex: 1 }}>
      {/* <GooglePlacesAutocomplete
        placeholder="Search or move the map"
        fetchDetails={true}
        onPress={(data, details) => {
          const point = details?.geometry?.location;
          if (!point) {
            console.error("Location details not found:", data);
            return;
          }
          setLocation({
            ...location,
            latitude: point.lat,
            longitude: point.lng,
          });
        }}
        query={{
          key: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
          language: "en",
        }}
        onFail={(error: any) => console.error("Autocomplete Error:", error)}
        renderLeftButton={() => (
          <View style={styles.boxIcon}>
            <Ionicons name="search-outline" size={24} color={Colors.medium} />
          </View>
        )}
        styles={{
          container: {
            flex: 0,
          },
          textInput: {
            backgroundColor: Colors.grey,
            paddingLeft: 35,
            borderRadius: 10,
          },
          textInputContainer: {
            padding: 8,
            backgroundColor: "#fff",
          },
        }}
      /> */}

      <MapView
        showsUserLocation={true}
        style={styles.map}
        region={location}
        onRegionChangeComplete={onRegionChangeComplete}>
        <Marker
          draggable={true}
          title="Long Press"
          description="Long Press this marker to change Location"
          coordinate={location}
          ref={markerRef}
          onDragEnd={(e) => {
            setLocation({
              ...location,
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude,
            });
          }}>
          <Image
            source={require("@/assets/data/map-pin.png")}
            style={{ width: 30, height: 42 }}
            resizeMode="contain"
          />

          <Callout style={{ width: 250 }}>
            <Text
              style={{ fontSize: 13, fontWeight: "800", textAlign: "center" }}>
              Press and hold the Marker to update your Location.Zoom out to see
              your Location Exactly.
            </Text>
          </Callout>
        </Marker>
      </MapView>
      <View style={styles.absoluteBox}>
        <TouchableOpacity
          style={styles.button}
          disabled={loading}
          onPress={onPressConfirm}>
          {loading ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}>
              <ActivityIndicator size="small" color="white" />
            </View>
          ) : (
            <Text style={styles.buttonText}>Confirm</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  absoluteBox: {
    position: "absolute",
    bottom: 35,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 16,
    margin: 16,
    alignItems: "center",
    borderRadius: 100,
    width: "60%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonTextLoading: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
    marginRight: 6,
  },
  boxIcon: {
    position: "absolute",
    left: 15,
    top: 18,
    zIndex: 1,
  },
});

export default LocationSearch;
