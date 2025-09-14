import React, {createContext, useState, ReactNode, useEffect} from 'react';
import RNSecureStorage, {ACCESSIBLE} from 'rn-secure-storage';
import axios from 'axios';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../global';
import {HOST_URL} from '@env';
import {ToastAndroid} from 'react-native';

// Helper function to get user-friendly error messages
const getErrorMessage = (error: any): string => {
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const message = error.response.data?.message || error.response.data?.error;

    switch (status) {
      case 400:
        return message || 'Invalid request. Please check your information.';
      case 401:
        return 'Invalid credentials. Please check your email and password.';
      case 403:
        return 'Invalid credentials or Credentials already exists.';
      case 404:
        return 'Service not found. Please try again later.';
      case 409:
        return message || 'Account already exists with this email.';
      case 422:
        return message || 'Please fill all required fields correctly.';
      case 429:
        return 'Too many attempts. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      case 503:
        return 'Service temporarily unavailable. Please try again later.';
      default:
        return message || `Error ${status}: Something went wrong.`;
    }
  } else if (error.request) {
    // Network error
    return 'Network error. Please check your internet connection.';
  } else if (error.message) {
    // Validation or other client-side errors
    return error.message;
  } else {
    // Other errors
    return 'An unexpected error occurred. Please try again.';
  }
};

// Define the CustomerAuthContext type
type CustomerAuthContextState = {
  isLoading: boolean;
  userToken: string | null;
  signIn: (
    email: string,
    password: string,
    phoneNumber: string,
  ) => Promise<void>;
  signUp: (
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    password: string,
  ) => Promise<void>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<string | null>;
};

// Create the CustomerAuthContext
export const CustomerAuthContext =
  createContext<CustomerAuthContextState | null>(null);

// Define the CustomerAuthProvider props type
type CustomerAuthProviderProps = {
  children: ReactNode;
  setUserType: (userType: 'vendor' | 'customer' | null) => void;
};

// Create the CustomerAuthProvider component
export const CustomerAuthProvider: React.FC<CustomerAuthProviderProps> = ({
  children,
  setUserType,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Check if the user is signed in when the component mounts
  useEffect(() => {
    isSignedIn();
  }, [userToken]);

  // Function to check if the user is signed in
  const isSignedIn = async () => {
    const isUserTokenStored = await RNSecureStorage.exist('userAccessToken');
    if (isUserTokenStored) {
      const value = await RNSecureStorage.getItem('userAccessToken');
      const {accessToken, expiry} = JSON.parse(value || '{}');

      if (accessToken && expiry) {
        const currentTime = new Date().getTime();
        if (currentTime < expiry) {
          setUserToken(accessToken);
          setIsLoading(false);
          ToastAndroid.showWithGravity(
            'Welcome back!',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
          );
          navigation.reset({
            index: 0,
            routes: [{name: 'CustomerHomeScreen'}],
          });
          return;
        } else {
          console.log('Token expired');
          ToastAndroid.showWithGravity(
            'Session expired. Please sign in again.',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
          );
          navigation.navigate('CustomerSignInScreen');
        }
      } else {
        console.log('Token expired');
        ToastAndroid.showWithGravity(
          'Session expired. Please sign in again.',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
        navigation.navigate('CustomerSignInScreen');
      }
    } else {
      console.log('Token not found');
      ToastAndroid.showWithGravity(
        'Please sign in to continue.',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
      navigation.navigate('CustomerSignInScreen');
    }
  };

  // Function to handle sign-in
  const signIn = async (
    email: string,
    password: string,
    phoneNumber: string,
  ) => {
    setIsLoading(true);
    ToastAndroid.showWithGravity(
      'Signing in...',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
    );

    try {
      // Input validation
      if (!email.trim() || !password.trim()) {
        throw new Error('Please enter both email and password.');
      }

      const isUserTokenStored = await RNSecureStorage.exist('userAccessToken');

      if (isUserTokenStored) {
        try {
          const value = await RNSecureStorage.getItem('userAccessToken');
          const {accessToken, expiry} = JSON.parse(value || '{}');

          if (accessToken && expiry) {
            const currentTime = new Date().getTime();
            if (currentTime < expiry) {
              setUserToken(accessToken);
              setIsLoading(false);
              ToastAndroid.showWithGravity(
                'Welcome back!',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
              );
              navigation.navigate('CustomerHomeScreen');
              return;
            } else {
              // Token expired, proceed with new sign in
              await requestSignIn(
                email.trim().toLowerCase(),
                password,
                phoneNumber.trim(),
              );
            }
          } else {
            await requestSignIn(
              email.trim().toLowerCase(),
              password,
              phoneNumber.trim(),
            );
          }
        } catch (storageError) {
          console.error('Storage error:', storageError);
          // If storage is corrupted, clear it and proceed with fresh sign in
          await RNSecureStorage.removeItem('userAccessToken');
          await requestSignIn(
            email.trim().toLowerCase(),
            password,
            phoneNumber.trim(),
          );
        }
      } else {
        await requestSignIn(
          email.trim().toLowerCase(),
          password,
          phoneNumber.trim(),
        );
      }
    } catch (error: any) {
      setIsLoading(false);
      const errorMessage = getErrorMessage(error);
      ToastAndroid.showWithGravity(
        errorMessage,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
      );
      console.error('Sign in error:', error);
    }
  };

  const requestSignIn = async (
    email: string,
    password: string,
    phoneNumber: string,
  ) => {
    try {
      const url = `${HOST_URL}/auth/customer/signin`;
      const response = await axios.post(url, {email, password, phoneNumber});
      const {accessToken, expiry} = response.data;
      console.log(response.data);

      await RNSecureStorage.setItem(
        'userAccessToken',
        JSON.stringify({
          accessToken,
          expiry,
        }),
        {
          accessible: ACCESSIBLE.WHEN_UNLOCKED,
        },
      );
      setUserToken(accessToken);
      setIsLoading(false);
      ToastAndroid.showWithGravity(
        'Sign in successful! Welcome back.',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
      navigation.navigate('CustomerHomeScreen');
    } catch (error: any) {
      setIsLoading(false);
      const errorMessage = getErrorMessage(error);
      ToastAndroid.showWithGravity(
        errorMessage,
        ToastAndroid.LONG, // Use LONG for error messages
        ToastAndroid.BOTTOM,
      );
      console.error('Sign in error:', error);
    }
  };

  const refreshToken = async () => {
    try {
      const url = `${HOST_URL}/auth/customer/refresh-token`;

      const response = await axios.post(url, {token: userToken});
      const {accessToken, expiry} = response.data;
      await RNSecureStorage.setItem(
        'userAccessToken',
        JSON.stringify({
          accessToken,
          expiry,
        }),
        {accessible: ACCESSIBLE.WHEN_UNLOCKED},
      );
      setUserToken(accessToken);
      return accessToken;
    } catch (error: any) {
      console.error('Error refreshing token: ', error);
      const errorMessage = getErrorMessage(error);
      ToastAndroid.showWithGravity(
        `Session expired: ${errorMessage}`,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
      );
      await signOut();
      return null;
    }
  };

  // Function to handle sign-up
  const signUp = async (
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    password: string,
  ) => {
    setIsLoading(true);
    ToastAndroid.showWithGravity(
      'Creating your account...',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
    );

    try {
      // Input validation
      if (
        !firstName.trim() ||
        !lastName.trim() ||
        !email.trim() ||
        !phoneNumber.trim() ||
        !password.trim()
      ) {
        throw new Error('Please fill all required fields.');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long.');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address.');
      }

      const url = `${HOST_URL}/auth/customer/signup`;
      const response = await axios.post(url, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        phoneNumber: phoneNumber.trim(),
        password,
      });
      const {accessToken, expiry} = response.data;

      await RNSecureStorage.setItem(
        'userAccessToken',
        JSON.stringify({
          accessToken,
          expiry,
        }),
        {
          accessible: ACCESSIBLE.WHEN_UNLOCKED,
        },
      );

      setUserToken(accessToken);
      console.log(accessToken);

      setIsLoading(false);
      ToastAndroid.showWithGravity(
        'Account created successfully! Welcome!',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
      navigation.navigate('CustomerHomeScreen');
    } catch (error: any) {
      setIsLoading(false);
      const errorMessage = getErrorMessage(error);
      ToastAndroid.showWithGravity(
        errorMessage,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
      );
      console.error('Sign up error:', error);
    }
  };

  // Function to handle sign-out
  const signOut = async () => {
    setIsLoading(true);
    ToastAndroid.showWithGravity(
      'Signing out...',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
    );

    try {
      // Try to remove tokens
      const removeTokenPromise = RNSecureStorage.removeItem('userAccessToken');
      const removeUserTypePromise = RNSecureStorage.removeItem('userType');

      await Promise.all([removeTokenPromise, removeUserTypePromise]);

      setUserToken(null);
      setUserType(null);
      setIsLoading(false);

      ToastAndroid.showWithGravity(
        'Signed out successfully. See you soon!',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    } catch (error: any) {
      setIsLoading(false);

      // Even if storage removal fails, we should still sign out the user
      setUserToken(null);
      setUserType(null);

      console.error('Error removing token from secure storage:', error);

      if (error.message?.includes('SecureStorage')) {
        ToastAndroid.showWithGravity(
          'Signed out, but failed to clear local data. Please restart the app.',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );
      } else {
        ToastAndroid.showWithGravity(
          'Signed out with some issues. Please restart the app if you experience problems.',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );
      }
    }
  };

  return (
    <CustomerAuthContext.Provider
      value={{signIn, signUp, signOut, refreshToken, isLoading, userToken}}>
      {children}
    </CustomerAuthContext.Provider>
  );
};
