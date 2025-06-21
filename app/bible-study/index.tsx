import { Text, View } from "react-native";
import { commonStyles } from "../../styles/theme";

export default function BibleStudyScreen() {
  return (
    <View style={commonStyles.centeredContainer}>
      <Text style={commonStyles.textLarge}>Bible Study Screen</Text>
    </View>
  );
}
