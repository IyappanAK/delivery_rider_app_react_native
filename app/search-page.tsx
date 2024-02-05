import React, { useRef, useEffect, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
  ToastAndroid,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import Colors from "@/constants/Colors";
import { searchMenus } from "@/core/services/home";
import Loading from "@/components/Pages/Loading";
import useBasketStore from "@/store/basketStore";

const SearchScreen = () => {
  const searchInputRef = useRef<TextInput>(null);
  const [searchText, setSearchText] = useState<any>("");

  const menus = searchMenus({});

  useEffect(() => {
    const focusInput = () => {
      searchInputRef.current?.focus();
    };

    const focusTimeout = setTimeout(focusInput, 500);

    return () => clearTimeout(focusTimeout);
  }, []);
  
  useEffect(() => {
    menus.mutate({ name: "   " });
  }, []);

  const navigation = useNavigation();
  const { addProduct } = useBasketStore();

  function goBack() {
    navigation.goBack();
  }
  const addToCart = (data: any) => {
    addProduct(data);
    ToastAndroid.showWithGravity(
      "Item Added to Cart",
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
  };

  function nav(data: any) {
    navigation.navigate("details", { data });
    navigation.canGoBack(true);
  }

  const handleInputChange = (text: any) => {
    setSearchText(text);
    setTimeout(() => menus.mutate({ name: text || "   " }), 1 * 1000);
  };

  const renderProductItem = ({ item }) => (
    <View style={styles.flex}>
      <TouchableOpacity style={styles.productItem} onPress={() => nav(item)}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <View style={styles.productDetails}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productRate}>
            Price: <Text style={{ fontWeight: "700" }}>₹{item.price}</Text>
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => addToCart(item)}>
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ backgroundColor: Colors.lightGrey, flex: 1 }}>
      <View style={styles.searchContainer}>
        <View style={styles.searchSection}>
          <TouchableOpacity onPress={goBack}>
            <Ionicons
              name="chevron-back"
              size={30}
              color={Colors.primary}
              mb={-2}
            />
          </TouchableOpacity>
          <View style={styles.searchField}>
            <Ionicons
              style={styles.searchIcon}
              name="ios-search"
              size={20}
              color={Colors.medium}
            />
            <TextInput
              ref={searchInputRef}
              style={styles.input}
              placeholder="Discover the dishes you love"
              value={searchText}
              onChangeText={handleInputChange}
            />
          </View>
        </View>
      </View>
      {!menus.isSuccess ? (
        <Loading />
      ) : (
        <FlatList
          data={menus?.data || []}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProductItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    height: 60,
    marginTop: 45,
    backgroundColor: Colors.primaryBg,
  },
  searchSection: {
    flexDirection: "row",
    gap: 10,
    flex: 1,
    paddingHorizontal: 10,
    paddingRight: 20,
    alignItems: "center",
  },
  searchField: {
    flex: 1,
    backgroundColor: Colors.lightGrey,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    padding: 10,
    color: Colors.mediumDark,
  },
  searchIcon: {
    paddingLeft: 10,
  },
  flex: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "white",
    padding: 10,
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "75%",
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  productDetails: {
    // flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productRate: {
    color: Colors.mediumDark,
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: 5,
    padding: 5,
  },
  addButtonText: {
    color: "#fff",
    padding: 2,
    paddingHorizontal: 12,
  },
});

export default SearchScreen;
