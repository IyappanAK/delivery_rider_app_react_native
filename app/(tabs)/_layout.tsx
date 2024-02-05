import Colors from "../../constants/Colors";
import { Tabs, useNavigation } from "expo-router";

import { Icon } from "@/constants/utils";
import { Ionicons } from "@expo/vector-icons";

import useBasketStore from "@/store/basketStore";
import CustomHeader from "@/components/CustomHeader";

import { TouchableOpacity } from "react-native-gesture-handler";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) {
  return <Ionicons size={28} style={{ marginBottom: -6 }} {...props} />;
}

export default function TabLayout() {
  const navigation = useNavigation();
  const { products } = useBasketStore();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          header: () => <CustomHeader />,
          title: "Home",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name={"ios-home-sharp"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: "Cart",
          tabBarBadge: products.length > 0 ? products.length : null,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              style={{ paddingLeft: 10 }}>
              <Icon name="chevron-back" size={28} color={Colors.primary} />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-cart" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="three"
        options={{
          title: "Favorites",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              style={{ paddingLeft: 10 }}>
              <Icon name="chevron-back" size={28} color={Colors.primary} />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-heart-sharp" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="four"
        options={{
          title: "Account",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="person-circle-outline" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
