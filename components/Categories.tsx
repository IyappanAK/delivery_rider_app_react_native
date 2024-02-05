import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "expo-router";
import Colors from "@/constants/Colors";

const Categories = (props: any) => {
  const { data } = props;
  const navigation = useNavigation();
  const [loadingColor, setLoadingColor] = React.useState("white")

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
    marginBottom: 8,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 6,
  },
  categoryCard: {
    flexBasis: "45%",
    height: 100,
    marginBottom: 32,
    backgroundColor: Colors.loadingColor,
    display: "flex",
    alignItems: "center",
    // elevation: 2,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 4,
    // },
    // shadowOpacity: 0.06,
    borderRadius: 6,
  },
  categoryText: {
    padding: 6,
    fontSize: 14,
    fontWeight: "700",
  },
});

export default Categories;
