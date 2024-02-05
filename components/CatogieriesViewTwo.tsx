import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "expo-router";

const CategoriesTwo = (props: any) => {
  const { data } = props;
  const navigation = useNavigation();

  function nav(id: any, name: any) {
    navigation.navigate("category-menu", { id, name });
    navigation.canGoBack(true);
  }

  return (
    <View style={styles.container}>
      {data?.map((category: any, index: any) => (
        <TouchableOpacity
          style={styles.categoryCard}
          key={index}
          onPress={() => nav(category.id, category.menu_category_name)}>
          <Image
            source={{
              uri: category.image,
            }}
            style={styles.image}
          />
          <Text style={styles.categoryText}>{category.menu_category_name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 15,
    paddingBottom: 0,
  },
  image: {
    width: "100%",
    height: "70%",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  categoryCard: {
    flexBasis: "31%",
    height: 100,
    marginBottom: 16,
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    borderRadius: 6,
  },
  categoryText: {
    padding: 6,
    fontSize: 14,
    fontWeight: "700",
  },
});

export default CategoriesTwo;
