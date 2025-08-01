import * as LocalAuthentication from 'expo-local-authentication';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { AppState } from 'react-native';

interface SecurityContextType {
  isAuthenticated: boolean;
  isSecurityEnabled: boolean;
  showSecurityCheck: boolean;
  isInitializing: boolean;
  authenticate: () => Promise<boolean>;
  enableSecurity: () => void;
  disableSecurity: () => void;
  lockApp: () => void;
  unlockApp: () => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(
  undefined
);

interface SecurityProviderProps {
  children: ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSecurityEnabled, setIsSecurityEnabled] = useState(true); // Default to enabled
  const [showSecurityCheck, setShowSecurityCheck] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true); // Track initialization state

  // Check if device supports biometric authentication
  const checkBiometricSupport = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      return hasHardware && isEnrolled;
    } catch (error) {
      console.error("Error checking biometric support:", error);
      return false;
    }
  };

  // Authenticate user
  const authenticate = async (): Promise<boolean> => {
    if (!isSecurityEnabled) {
      setIsAuthenticated(true);
      return true;
    }

    try {
      const isSupported = await checkBiometricSupport();

      if (!isSupported) {
        // If biometric is not supported, allow access but show a message
        console.log("Biometric authentication not available, allowing access");
        setIsAuthenticated(true);
        return true;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to access PassCode",
        fallbackLabel: "Use device PIN/password",
        cancelLabel: "Cancel",
        disableDeviceFallback: false,
        requireAuthentication: true,
      });

      if (result.success) {
        setIsAuthenticated(true);
        setShowSecurityCheck(false);
        return true;
      } else {
        setIsAuthenticated(false);
        return false;
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setIsAuthenticated(false);
      return false;
    }
  };

  // Enable security
  const enableSecurity = () => {
    setIsSecurityEnabled(true);
    lockApp();
  };

  // Disable security
  const disableSecurity = () => {
    setIsSecurityEnabled(false);
    setIsAuthenticated(true);
    setShowSecurityCheck(false);
  };

  // Lock the app
  const lockApp = () => {
    setIsAuthenticated(false);
    setShowSecurityCheck(true);
  };

  // Unlock the app
  const unlockApp = () => {
    setIsAuthenticated(true);
    setShowSecurityCheck(false);
  };

  // Check authentication on app start
  useEffect(() => {
    const initializeSecurity = async () => {
      if (isSecurityEnabled) {
        await authenticate();
      } else {
        setIsAuthenticated(true);
        setShowSecurityCheck(false);
      }
      setIsInitializing(false);
    };

    initializeSecurity();
  }, [isSecurityEnabled]);

  // Handle app state changes to lock app when going to background
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (
        isSecurityEnabled &&
        (nextAppState === "background" || nextAppState === "inactive")
      ) {
        lockApp();
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => subscription?.remove();
  }, [isSecurityEnabled, lockApp]);

  const value: SecurityContextType = {
    isAuthenticated,
    isSecurityEnabled,
    showSecurityCheck,
    isInitializing,
    authenticate,
    enableSecurity,
    disableSecurity,
    lockApp,
    unlockApp,
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};

// Custom hook to use security context
export const useSecurity = (): SecurityContextType => {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
}; 
