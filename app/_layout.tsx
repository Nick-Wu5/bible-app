import { FABContainer, FABProvider, useFAB } from "@/components/FAB";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Stack } from "expo-router";
import React from "react";

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const { handleFABPress } = useFAB();

  if (isLoading) return null;

  if (!isAuthenticated) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth" />
      </Stack>
    );
  }

  return (
    <>
      <Stack>
        {/* Hidden redirect screen */}
        <Stack.Screen name="index" options={{ headerShown: false }} />

        {/* Main app with tabs */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Camera modal */}
        <Stack.Screen
          name="camera"
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />
      </Stack>

      {/* FAB for camera access */}
      <FABContainer onPress={handleFABPress} />
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <FABProvider>
        <AppContent />
      </FABProvider>
    </AuthProvider>
  );
}
