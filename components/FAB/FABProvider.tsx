import { router } from "expo-router";
import React, { createContext, useCallback, useContext, useState } from "react";

interface FABContextType {
  isVisible: boolean;
  isDisabled: boolean;
  showFAB: () => void;
  hideFAB: () => void;
  disableFAB: () => void;
  enableFAB: () => void;
  handleFABPress: () => void;
}

const FABContext = createContext<FABContextType | undefined>(undefined);

interface FABProviderProps {
  children: React.ReactNode;
}

export const FABProvider: React.FC<FABProviderProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);

  const showFAB = useCallback(() => {
    setIsVisible(true);
  }, []);

  const hideFAB = useCallback(() => {
    setIsVisible(false);
  }, []);

  const disableFAB = useCallback(() => {
    setIsDisabled(true);
  }, []);

  const enableFAB = useCallback(() => {
    setIsDisabled(false);
  }, []);

  const handleFABPress = useCallback(() => {
    // Navigate to camera as modal
    router.push("/camera");
  }, []);

  const value: FABContextType = {
    isVisible,
    isDisabled,
    showFAB,
    hideFAB,
    disableFAB,
    enableFAB,
    handleFABPress,
  };

  return <FABContext.Provider value={value}>{children}</FABContext.Provider>;
};

export const useFAB = (): FABContextType => {
  const context = useContext(FABContext);
  if (context === undefined) {
    throw new Error("useFAB must be used within a FABProvider");
  }
  return context;
};
