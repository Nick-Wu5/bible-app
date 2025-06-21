import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useDatabase } from "../../contexts/DatabaseContext";
import { commonStyles } from "../../styles/theme";
import { themeUtils } from "../../styles/themeUtils";
import {
  addTestData,
  debugDatabase,
  getDatabaseInfo,
  resetDatabase,
} from "../../utils/databaseDebug";

export default function LibraryScreen() {
  const { database, isLoading, error, currentUser } = useDatabase();

  const handleDebugDatabase = async () => {
    console.log("🔍 Debugging database...");
    await debugDatabase();
  };

  const handleAddTestData = async () => {
    console.log("➕ Adding test data...");
    await addTestData();
  };

  const handleResetDatabase = async () => {
    console.log("🗑️ Resetting database...");
    await resetDatabase();
  };

  const handleGetDatabaseInfo = async () => {
    console.log("📊 Getting database info...");
    await getDatabaseInfo();
  };

  if (isLoading) {
    return (
      <View style={commonStyles.centeredContainer}>
        <Text style={commonStyles.loadingText}>Loading Database...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={commonStyles.centeredContainer}>
        <Text style={commonStyles.textLarge}>Database Error</Text>
        <Text style={commonStyles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={commonStyles.screenContainer}>
      <View style={commonStyles.centeredContainer}>
        <Text style={commonStyles.textLarge}>Library Screen</Text>
        <Text style={commonStyles.textSmall}>Database Status: Connected</Text>
        <Text style={commonStyles.textSmall}>User: {currentUser?.name}</Text>
        <Text style={commonStyles.textSmall}>
          Translation: {currentUser?.preferredTranslation}
        </Text>

        {/* Debug Section */}
        <View style={{ marginTop: 40, width: "100%" }}>
          <Text style={commonStyles.sectionTitle}>Debug Tools</Text>

          <TouchableOpacity
            style={[commonStyles.button, themeUtils.spacing.marginBottom("sm")]}
            onPress={handleGetDatabaseInfo}
          >
            <Text style={commonStyles.buttonText}>📊 Database Info</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[commonStyles.button, themeUtils.spacing.marginBottom("sm")]}
            onPress={handleDebugDatabase}
          >
            <Text style={commonStyles.buttonText}>🔍 View Database</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[commonStyles.button, themeUtils.spacing.marginBottom("sm")]}
            onPress={handleAddTestData}
          >
            <Text style={commonStyles.buttonText}>➕ Add Test Data</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[commonStyles.button, { backgroundColor: "#FF3B30" }]}
            onPress={handleResetDatabase}
          >
            <Text style={commonStyles.buttonText}>🗑️ Reset Database</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
