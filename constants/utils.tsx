import { Ionicons } from "@expo/vector-icons";
import { Dimensions } from "react-native";

export function Icon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
  size: number;
  mb: number;
}) {
  const { mb } = props;
  return <Ionicons style={{ marginBottom: mb ? mb : -2 }} {...props} />;
}

let fullwidth = Dimensions.get("window").width;
let fullheight = Dimensions.get("window").height;

export default {
  fullwidth,
  fullheight,
};
