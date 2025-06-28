import { Stack } from "expo-router";
import { colors } from "@/styles/theme";

export default function CameraLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTitleStyle: {
          fontWeight: "600",
        },
        headerTintColor: colors.textPrimary,
        presentation: "modal",
        animation: "slide_from_bottom",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Camera",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
