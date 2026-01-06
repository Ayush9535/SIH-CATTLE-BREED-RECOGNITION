import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
  ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';
import { sendOtp, verifyOtp } from '../src/services/authService';
import { useLanguage } from '../src/contexts/LanguageContext';
import { useAuth } from '../src/contexts/AuthContext';
import { ServiceHealthIndicator } from '../src/components/ServiceHealthIndicator';

export default function LoginScreen(): React.JSX.Element {
  const router = useRouter();
  const { t } = useLanguage();
  const { setUser, loginAsGuest } = useAuth();

  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const otpInputs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = async () => {
    if (!phone || phone.length !== 10) {
      Alert.alert(t('login.invalidPhone'), t('login.enterValid10'));
      return;
    }

    setLoading(true);
    try {
      await sendOtp(phone);
      setStep('OTP');
      setTimer(30); // 30 seconds cooldown
      // Alert removed as per user request
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 4) {
      Alert.alert(t('login.invalidOtp'), t('login.enter4Digit'));
      return;
    }

    setLoading(true);
    try {
      const user = await verifyOtp(phone, otpString);
      setUser(user);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert(t('login.verificationFailed'), error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSkipLogin = () => {
    loginAsGuest();
    router.replace('/(tabs)');
  };

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next input
    if (text && index < 3) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/loginBackground.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Back Button - Only show when in OTP mode to change number */}
            {step === 'OTP' && (
              <TouchableOpacity style={styles.backBtn} onPress={() => {
                setStep('PHONE');
                setOtp(['', '', '', '']);
              }}>
                <Text style={styles.backBtnText}>← {t('login.changeNumber')}</Text>
              </TouchableOpacity>
            )}

            {/* Header */}
            <View style={styles.header}>

              <View style={styles.iconBadge}>
                <Image
                  source={require('../assets/images/a6Logo.png')}
                  style={styles.logoImage}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.headerTitle}>
                {step === 'PHONE' ? t('login.welcome') : t('login.verification')}
              </Text>
              <Text style={styles.headerSubtitle}>
                {step === 'PHONE'
                  ? t('login.subtitle')
                  : t('login.enterOtp', { phone: `+91 XXXXX XXX${phone.slice(-3)}` })
                }
              </Text>
            </View>

            <ServiceHealthIndicator />

            <View style={styles.form}>
              {step === 'PHONE' ? (
                // Phone Input Step
                <View>
                  <View style={styles.phoneInputContainer}>
                    <View style={styles.countryCode}>
                      <Text style={styles.flag}>🇮🇳</Text>
                      <Text style={styles.codeText}>+91</Text>
                    </View>
                    <TextInput
                      style={styles.phoneInput}
                      placeholder={t('login.mobilePlaceholder')}
                      placeholderTextColor="#9ca3af"
                      value={phone}
                      onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, '').slice(0, 10))}
                      keyboardType="number-pad"
                      maxLength={10}
                      editable={!loading}
                    />
                  </View>

                  <TouchableOpacity
                    style={[styles.primaryBtn, loading && styles.btnDisabled]}
                    onPress={handleSendOtp}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text style={styles.btnText}>{t('login.getOtp')}</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.skipBtn}
                    onPress={handleSkipLogin}
                    disabled={loading}
                  >
                    <Text style={styles.skipBtnText}>{t('login.skipGuest')}</Text>
                  </TouchableOpacity>

                  {/* <TouchableOpacity
                    style={styles.skipBtn}
                    onPress={() => router.push('/test-breed-detector' as any)}
                    disabled={loading}
                  >
                    <Text style={styles.skipBtnText}>Test Breed Detector</Text>
                  </TouchableOpacity> */}
                </View>
              ) : (
                // OTP Input Step
                <View>
                  <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                      <TextInput
                        key={index}
                        ref={(ref) => (otpInputs.current[index] = ref)}
                        style={styles.otpInput}
                        value={digit}
                        onChangeText={(text) => handleOtpChange(text, index)}
                        onKeyPress={(e) => handleOtpKeyPress(e, index)}
                        keyboardType="number-pad"
                        maxLength={1}
                        editable={!loading}
                      />
                    ))}
                  </View>

                  <TouchableOpacity
                    style={[styles.primaryBtn, loading && styles.btnDisabled]}
                    onPress={handleVerifyOtp}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text style={styles.btnText}>{t('login.verifyLogin')}</Text>
                    )}
                  </TouchableOpacity>

                  <View style={styles.resendContainer}>
                    {timer > 0 ? (
                      <Text style={styles.timerText}>{t('login.resendIn', { seconds: timer })}</Text>
                    ) : (
                      <TouchableOpacity onPress={handleSendOtp} disabled={loading}>
                        <Text style={styles.resendLink}>{t('login.resend')}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(67, 67, 67, 0.63)', // Semi-transparent overlay
  },
  container: {
    flex: 1,
    // Background color moved to overlay
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 24,
    zIndex: 10,
  },
  backBtnText: {
    fontSize: 16,
    color: '#f3f3f3ff',
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  gifContainer: {
    marginBottom: 10,
    alignItems: 'center',
  },
  helloGif: {
    width: 150,
    height: 150,
  },
  iconBadge: {
    width: 250,
    height: 250,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#f3f3f3ff',
    marginBottom: 8,
    marginTop: -40,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#f3f3f3ff',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  form: {
    width: '100%',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 24,
    overflow: 'hidden',
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: '#f3f4f6',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
  },
  flag: {
    fontSize: 20,
    marginRight: 8,
  },
  codeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 18,
    fontSize: 18,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: 'white',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  primaryBtn: {
    backgroundColor: '#667eea',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnDisabled: {
    opacity: 0.7,
    backgroundColor: '#9ca3af',
  },
  btnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  resendContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  timerText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  resendLink: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
  },
  skipBtn: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipBtnText: {
    color: '#f3f3f3ff',
    fontSize: 16
  },
});
