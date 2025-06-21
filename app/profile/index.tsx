import { Text, View } from "react-native";
import { commonStyles } from "../../styles/theme";

export default function ProfileScreen() {
  return (
    <View style={commonStyles.centeredContainer}>
      <Text style={commonStyles.textLarge}>Profile Screen</Text>
    </View>
  );
}
