import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface SecurityCheckProps {
  onAuthenticated: () => void;
  isVisible: boolean;
}

const SecurityCheck: React.FC<SecurityCheckProps> = ({ onAuthenticated, isVisible }) => {
  const [isChecking, setIsChecking] = useState(true); // Start with checking state
  const [authError, setAuthError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true); // New state for initial load

  const checkBiometricSupport = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware) {
        setAuthError(
          "Biometric authentication is not available on this device."
        );
        return false;
      }

      if (!isEnrolled) {
        setAuthError("No biometric authentication is set up on this device.");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error checking biometric support:", error);
      setAuthError("Unable to check biometric support.");
      return false;
    }
  };

  const authenticate = async () => {
    setIsChecking(true);
    setAuthError(null);

    try {
      const isSupported = await checkBiometricSupport();

      if (!isSupported) {
        setIsChecking(false);
        setIsInitializing(false);
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to access PassCode",
        fallbackLabel: "Use device PIN/password",
        cancelLabel: "Cancel",
        disableDeviceFallback: false,
      });

      if (result.success) {
        onAuthenticated();
      } else {
        // Handle different error cases
        if (result.error) {
          setAuthError("Authentication failed. Please try again.");
        } else {
          setAuthError("Authentication was cancelled.");
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setAuthError("An error occurred during authentication.");
    } finally {
      setIsChecking(false);
      setIsInitializing(false);
    }
  };

  const retryAuthentication = () => {
    setAuthError(null);
    setIsInitializing(false);
    authenticate();
  };

  useEffect(() => {
    if (isVisible) {
      authenticate();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
      statusBarTranslucent={true}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="shield-checkmark" size={80} color="#0078D7" />
          </View>

          <Text style={styles.title}>PassCode Security</Text>
          <Text style={styles.subtitle}>
            Verify your identity to access your passwords
          </Text>

          {isInitializing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0078D7" />
              <Text style={styles.loadingText}>Setting up security...</Text>
            </View>
          ) : isChecking ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0078D7" />
              <Text style={styles.loadingText}>
                Ready for authentication...
              </Text>
            </View>
          ) : authError ? (
            <View style={styles.errorContainer}>
              <Ionicons name="warning" size={24} color="#FF6B6B" />
              <Text style={styles.errorText}>{authError}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={retryAuthentication}
              >
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.authButton} onPress={authenticate}>
              <Ionicons name="finger-print" size={24} color="white" />
              <Text style={styles.authButtonText}>Authenticate</Text>
            </TouchableOpacity>
          )}

          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              Use your fingerprint, Face ID, or device PIN/password to unlock
              the app
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
    padding: 32,
  },
  iconContainer: {
    marginBottom: 24,
    padding: 20,
    backgroundColor: 'rgba(0, 120, 215, 0.1)',
    borderRadius: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    alignItems: 'center',
    marginBottom: 32,
    padding: 16,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 12,
    width: '100%',
  },
  errorText: {
    marginTop: 8,
    fontSize: 14,
    color: '#FF6B6B',
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#0078D7',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0078D7',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 32,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  authButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: 'rgba(0, 120, 215, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 120, 215, 0.2)',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default SecurityCheck; 
