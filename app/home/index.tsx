import { Text, View } from "react-native";
import { commonStyles } from "../../styles/theme";

export default function HomeScreen() {
  return (
    <View style={commonStyles.centeredContainer}>
      <Text style={commonStyles.textLarge}>Home Screen</Text>
    </View>
  );
}
