import { Stack } from "expo-router";

export default function BibleStudyLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Bible Study",
        }}
      />
    </Stack>
  );
}
