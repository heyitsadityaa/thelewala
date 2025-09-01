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

// Define the VendorAuthContext type
type VendorAuthContextState = {
  isLoading: boolean;
  userToken: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    businessName: string,
    contactPerson: string,
    email: string,
    phoneNumber: string,
    password: string,
    confirmPassword: string,
    businessCategory: string,
    businessAddress: string,
  ) => Promise<void>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<string | null>;
};

// Create the VendorAuthContext
export const VendorAuthContext = createContext<VendorAuthContextState | null>(
  null,
);

// Define the VendorAuthProvider props type
type VendorAuthProviderProps = {
  children: ReactNode;
  setUserType: (userType: 'vendor' | 'customer' | null) => void;
};

// Create the VendorAuthProvider component
export const VendorAuthProvider: React.FC<VendorAuthProviderProps> = ({
  children,
  setUserType,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Check if the user is signed in when the component mounts
  useEffect(() => {
    isSignedIn();
  }, [userToken]); // Function to check if the user is signed in
  const isSignedIn = async () => {
    try {
      // Normal auth flow
      const isUserTokenStored = await RNSecureStorage.exist('userAccessToken');
      if (isUserTokenStored) {
        // Check if the user is already signed in and the token is still valid
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
              routes: [{name: 'VendorHomeScreen'}],
            });
            return;
          } else {
            console.log('Token expired');
            // Clear expired token
            await RNSecureStorage.removeItem('userAccessToken');
            ToastAndroid.showWithGravity(
              'Session expired. Please sign in again.',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
            );
            navigation.navigate('VendorSignInScreen');
          }
        } else {
          console.log('Invalid token data');
          // Clear invalid token
          await RNSecureStorage.removeItem('userAccessToken');
          ToastAndroid.showWithGravity(
            'Please sign in to continue.',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
          );
          navigation.navigate('VendorSignInScreen');
        }
      } else {
        console.log('Token not found');
        ToastAndroid.showWithGravity(
          'Please sign in to continue.',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
        navigation.navigate('VendorSignInScreen');
      }
    } catch (error: any) {
      console.error('Error checking sign-in status:', error);
      // On any error, navigate to sign-in screen
      ToastAndroid.showWithGravity(
        'Error loading session. Please sign in.',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
      );
      navigation.navigate('VendorSignInScreen');
    }
  };

  // Function to handle sign-in
  const signIn = async (email: string, password: string) => {
    console.log('Signing signin in...');
    ToastAndroid.showWithGravity(
      'Signing in...',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
    );
    setIsLoading(true);

    try {
      // Input validation
      if (!email.trim() || !password.trim()) {
        throw new Error('Please enter both email and password.');
      }

      if (!email.trim().includes('@')) {
        throw new Error('Please enter a valid email address.');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long.');
      }

      // Check if userToken is already stored in secure storage or not
      const isUserTokenStored = await RNSecureStorage.exist('userAccessToken');
      console.log({isUserTokenStored});

      if (isUserTokenStored) {
        try {
          // Check if the user is already signed in and the token is still valid
          const value = await RNSecureStorage.getItem('userAccessToken');
          value && console.log(JSON.parse(JSON.stringify(value)));

          const {accessToken, expiry} = JSON.parse(value || '{}');
          console.log({accessToken, expiry});

          if (accessToken && expiry) {
            const currentTime = new Date().getTime();
            if (currentTime < expiry) {
              setUserToken(accessToken);
              setIsLoading(false);
              ToastAndroid.showWithGravity(
                'Welcome back! Using saved session.',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
              );
              navigation.navigate('VendorHomeScreen');
              return;
            } else {
              console.log('Token expired');
              await requestSignIn(email.trim().toLowerCase(), password);
            }
          } else {
            console.log('Token not found');
            await requestSignIn(email.trim().toLowerCase(), password);
          }
        } catch (storageError) {
          console.error('Storage error:', storageError);
          // If storage is corrupted, clear it and proceed with fresh sign in
          await RNSecureStorage.removeItem('userAccessToken');
          await requestSignIn(email.trim().toLowerCase(), password);
        }
      } else {
        console.log('Token not found');
        await requestSignIn(email.trim().toLowerCase(), password);
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

  const requestSignIn = async (email: string, password: string) => {
    try {
      // Make a POST request to the server to sign in
      const url = `${HOST_URL}/auth/vendor/signin`;
      const response = await axios.post(url, {
        email,
        password,
      });
      const {accessToken, expiry} = response.data;

      // Store the token in secure storage
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

      // Set the user token in state
      setUserToken(accessToken);
      setIsLoading(false);
      ToastAndroid.showWithGravity(
        'Sign in successful',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
      navigation.navigate('VendorHomeScreen');
    } catch (error: any) {
      console.log(`Error signing in:`, error);
      const errorMessage = getErrorMessage(error);
      ToastAndroid.showWithGravity(
        errorMessage,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
      );
      setIsLoading(false);
      throw error; // Re-throw to be handled by the calling function
    }
  };

  // Add refreshToken function
  const refreshToken = async () => {
    try {
      const url = `${HOST_URL}/auth/vendor/refresh-token`;
      // Pass the current token (or any required data) to refresh
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
      ToastAndroid.showWithGravity(
        'Session refreshed successfully',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
      return accessToken;
    } catch (error: any) {
      console.error('Error refreshing token:', error);
      const errorMessage = getErrorMessage(error);

      // On refresh token failure, sign out the user
      await signOut();

      ToastAndroid.showWithGravity(
        `Session expired: ${errorMessage}`,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
      );
      return null;
    }
  };

  // Function to handle sign-up
  const signUp = async (
    businessName: string,
    contactPerson: string,
    email: string,
    phoneNumber: string,
    password: string,
    confirmPassword: string,
    businessCategory: string,
    businessAddress: string,
  ) => {
    setIsLoading(true);
    ToastAndroid.showWithGravity(
      'Signing up...',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
    );

    try {
      // Input validation
      if (!businessName.trim()) {
        throw new Error('Business name is required.');
      }
      if (!contactPerson.trim()) {
        throw new Error('Contact person name is required.');
      }
      if (!email.trim()) {
        throw new Error('Email is required.');
      }
      if (!email.trim().includes('@')) {
        throw new Error('Please enter a valid email address.');
      }
      if (!phoneNumber.trim()) {
        throw new Error('Phone number is required.');
      }
      if (!password.trim()) {
        throw new Error('Password is required.');
      }
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long.');
      }
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match.');
      }
      if (!businessCategory.trim()) {
        throw new Error('Business category is required.');
      }
      if (!businessAddress.trim()) {
        throw new Error('Business address is required.');
      }

      // Make a POST request to the server to sign up
      const url = `${HOST_URL}/auth/vendor/signup`;
      const response = await axios.post(url, {
        businessName: businessName.trim(),
        contactPerson: contactPerson.trim(),
        email: email.trim().toLowerCase(),
        phoneNumber: phoneNumber.trim(),
        password,
        confirmPassword,
        businessCategory: businessCategory.trim(),
        businessAddress: businessAddress.trim(),
      });

      const {accessToken, expiry} = response.data;

      // Store the token in secure storage
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

      // Set the user token in state
      setUserToken(accessToken);
      setIsLoading(false);
      ToastAndroid.showWithGravity(
        'Sign up successful! Welcome to TheLeWala.',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
      navigation.navigate('VendorHomeScreen');
    } catch (error: any) {
      console.log(`Error signing up:`, error);
      setIsLoading(false);
      const errorMessage = getErrorMessage(error);
      ToastAndroid.showWithGravity(
        errorMessage,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
      );
    }
  };

  // Function to handle sign-out
  const signOut = async () => {
    setIsLoading(true);

    try {
      // Remove stored tokens and user type
      const removePromises = [
        RNSecureStorage.removeItem('userAccessToken'),
        RNSecureStorage.removeItem('userType'),
      ];

      await Promise.all(removePromises);

      // Clear state
      setUserToken(null);
      setUserType(null);
      setIsLoading(false);

      ToastAndroid.showWithGravity(
        'Signed out successfully',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );

      // Navigation handled by App.tsx when userType becomes null
    } catch (error: any) {
      console.error('Error signing out:', error);
      setIsLoading(false);

      // Even if there's an error removing from storage, clear the state
      setUserToken(null);
      setUserType(null);

      ToastAndroid.showWithGravity(
        'Sign out completed with warnings. You are now logged out.',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
      );
    }
  };

  return (
    <VendorAuthContext.Provider
      value={{signIn, signUp, signOut, refreshToken, isLoading, userToken}}>
      {children}
    </VendorAuthContext.Provider>
  );
};
