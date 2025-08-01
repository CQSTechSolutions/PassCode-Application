import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface SecurityRecommendationProps {
  onContinue: () => void;
  onSetupSecurity: () => void;
}

const SecurityRecommendation: React.FC<SecurityRecommendationProps> = ({
  onContinue,
  onSetupSecurity,
}) => {
  const handleContinueWithoutSecurity = () => {
    Alert.alert(
      'Security Warning',
      'You are choosing to use PassCode without device security. Your passwords will be less protected. Are you sure you want to continue?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Continue Anyway',
          style: 'destructive',
          onPress: onContinue,
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="warning" size={60} color="#FF9500" />
            </View>
            <Text style={styles.title}>Security Recommendation</Text>
            <Text style={styles.subtitle}>
              Your device is not secured with biometric authentication
            </Text>
          </View>

          {/* Security Benefits */}
          <View style={styles.benefitsSection}>
            <Text style={styles.sectionTitle}>Why Secure Your Device?</Text>
            
            <View style={styles.benefitItem}>
              <Ionicons name="shield-checkmark" size={24} color="#0078D7" />
              <View style={styles.benefitText}>
                <Text style={styles.benefitTitle}>Protect Your Passwords</Text>
                <Text style={styles.benefitDescription}>
                  Prevent unauthorized access to your stored passwords
                </Text>
              </View>
            </View>

            <View style={styles.benefitItem}>
              <Ionicons name="finger-print" size={24} color="#0078D7" />
              <View style={styles.benefitText}>
                <Text style={styles.benefitTitle}>Quick & Convenient</Text>
                <Text style={styles.benefitDescription}>
                  Use fingerprint or Face ID for instant access
                </Text>
              </View>
            </View>

            <View style={styles.benefitItem}>
              <Ionicons name="lock-closed" size={24} color="#0078D7" />
              <View style={styles.benefitText}>
                <Text style={styles.benefitTitle}>Device-Level Security</Text>
                <Text style={styles.benefitDescription}>
                  Leverage your device's built-in security features
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsSection}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleContinueWithoutSecurity}
            >
              <Ionicons name="arrow-forward" size={20} color="#666" />
              <Text style={styles.secondaryButtonText}>
                Continue Without Security
              </Text>
            </TouchableOpacity>
          </View>

          {/* Warning */}
          <View style={styles.warningSection}>
            <Ionicons name="information-circle" size={20} color="#FF6B6B" />
            <Text style={styles.warningText}>
              Without device security, your passwords are only protected by the app itself.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
    borderRadius: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  benefitsSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  benefitText: {
    marginLeft: 12,
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  instructionsSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  instructionStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0078D7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    flex: 1,
  },
  actionsSection: {
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#0078D7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  warningSection: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  warningText: {
    fontSize: 14,
    color: '#FF6B6B',
    lineHeight: 20,
    marginLeft: 8,
    flex: 1,
  },
});

export default SecurityRecommendation; 
