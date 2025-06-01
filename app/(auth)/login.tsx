import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/constants/theme';
import { images } from '@/constants/images';
import { LogIn, User, Lock, ChevronRight } from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useUser } from '../../context/UserContext';


export default function LoginScreen() {
  const router = useRouter();
  const userContext = useUser();
  if (!userContext) {
    throw new Error('UserContext is not available');
  }
  const { setUser } = userContext;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const authenticateUser = async (email: string, password: string) => {
    // Replace this with your actual API call
    const response = await new Promise((resolve) =>
      setTimeout(() =>
        resolve({
          ok: true,
          json: () => Promise.resolve({ 
            token: 'demo-token', 
            user: { 
              email, 
              name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)
            } 
          }),
        }), 1000)
    ) as { ok: boolean; json: () => Promise<any> };

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const userData = await response.json();
    return userData;
  };

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const userData = await authenticateUser(email, password);
      setUser(userData.user); // Store user data in context
      router.replace('/(tabs)'); // Navigate to the home screen
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      // Replace with actual Google authentication logic
      // Simulate Google login for demo
      const googleUser = {
        email: 'user@gmail.com',
        name: 'Google User'
      };
      setUser(googleUser);
      router.replace('/(tabs)');
    } catch (err) {
      setError('Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: images.backgrounds.login }}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      <LinearGradient
        colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
        style={styles.overlay}
      />
      
      <View style={styles.contentContainer}>
        <Animated.View entering={FadeIn.delay(300).duration(1000)} style={styles.headerContainer}>
          <Text style={styles.appName}>BodyBoss Fitness</Text>
          <Text style={styles.tagline}>Your AI Fitness Companion</Text>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(600).duration(1000)} style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <User size={20} color={theme.colors.neutral[500]} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={theme.colors.neutral[400]}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Lock size={20} color={theme.colors.neutral[500]} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={theme.colors.neutral[400]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => {}}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : (
              <>
                <Text style={styles.loginButtonText}>Login</Text>
                <ChevronRight size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>
          
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>
          
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleLogin}
            disabled={loading}
          >
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>
          
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.registerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: theme.spacing.xl,
  },
  headerContainer: {
    marginTop: Platform.OS === 'ios' ? 60 : 40,
    alignItems: 'center',
  },
  appName: {
    fontFamily: theme.fonts.heading.bold,
    fontSize: theme.fontSizes.display,
    color: '#fff',
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  tagline: {
    fontFamily: theme.fonts.body.regular,
    fontSize: theme.fontSizes.lg,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    ...theme.shadows.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.neutral[300],
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    height: 50,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    fontFamily: theme.fonts.body.regular,
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: theme.spacing.md,
  },
  forgotPasswordText: {
    fontFamily: theme.fonts.body.medium,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.primary[600],
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary[600],
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    marginVertical: theme.spacing.md,
  },
  loginButtonText: {
    fontFamily: theme.fonts.body.semiBold,
    fontSize: theme.fontSizes.md,
    color: '#fff',
    marginRight: theme.spacing.xs,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.neutral[300],
  },
  dividerText: {
    fontFamily: theme.fonts.body.medium,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.neutral[500],
    marginHorizontal: theme.spacing.md,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: theme.colors.neutral[300],
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  googleButtonText: {
    fontFamily: theme.fonts.body.medium,
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontFamily: theme.fonts.body.regular,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.neutral[600],
  },
  registerLink: {
    fontFamily: theme.fonts.body.semiBold,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.primary[600],
    marginLeft: 4,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
});
