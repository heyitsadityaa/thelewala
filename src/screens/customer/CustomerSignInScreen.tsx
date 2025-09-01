import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../global';
import { CustomerAuthContext } from '../../context/CustomerAuthContext';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Categories from '../../components/Categories';
import SignInOptions from '../../components/SignInOptions';

interface CustomerSignInScreenProps {
  setUserType: React.Dispatch<
    React.SetStateAction<'vendor' | 'customer' | null | undefined>
  >;
  userType: 'vendor' | 'customer' | null | undefined;
}

const CustomerSignInScreen: React.FC<CustomerSignInScreenProps> = ({
  setUserType,
  userType,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const authContext = useContext(CustomerAuthContext);
  const theme = useColorScheme();
  const [formData, setFormData] = useState({
    phoneNumber: '',
    email: '',
    password: '',
  });

  // If user is already authenticated or token was refreshed, navigate to CustomerHomeScreen
  useEffect(() => {
    if (authContext?.userToken) {
      navigation.navigate('CustomerHomeScreen');
    }
  }, [authContext?.userToken, navigation]);

  // Change function name to handleSignIn
  const handleSignIn = async () => {
    if (
      formData.email.trim() === '' ||
      formData.password.trim() === ''
    ) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    try {
      console.log('Signing in...', { userType });
      await authContext?.signIn(
        formData.email,
        formData.password,
        formData.phoneNumber,
      );
    } catch (error) {
      console.log('signIn', error);
    }
  };

  // New function to handle navigation to the sign up screen
  const handleSignUpNavigation = () => {
    navigation.navigate('CustomerSignUpScreen');
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView
      className={`flex-1 bg-light-background dark:bg-dark-background`}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <ScrollView className="flex-1">
            <View className="p-5">
              {/* Logo Section */}
              <View className="items-center mb-8">
                <View className="mb-4">
                  <Image
                    resizeMode="contain"
                    source={
                      theme === 'dark'
                        ? require('../../assets/images/logodark.png')
                        : require('../../assets/images/logo.png')
                    }
                    alt="logo"
                    className="w-28 h-10"
                  />
                </View>

                {/* Banner Image */}
                <View className="w-full h-40 rounded-lg overflow-hidden mb-4">
                  <Image
                    source={require('../../assets/images/customerSignin.png')}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
              </View>

              {/* Welcome Text */}
              <View className="items-center mb-8">
                <Text
                  className={`text-xl font-medium mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                    }`}>
                  Welcome back!
                </Text>
                <Text
                  className={`text-sm text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                  Sign in with your phone number, email, or social accounts to
                  explore our marketplace of local goods and services.
                </Text>
              </View>

              {/* Auth Container */}
              <View
                className={`rounded-lg p-6 mb-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                  }`}>
                {/* Toggle Buttons */}
                <View className="flex-row mb-6">
                  <View
                    className={`flex-1 border-b-2 pb-2 ${theme === 'dark' ? 'border-[#16BC88]' : 'border-[#16BC88]'
                      }`}>
                    <Text
                      className={`text-center font-medium ${theme === 'dark' ? 'text-[#16BC88]' : 'text-[#16BC88]'
                        }`}>
                      Sign In
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={handleSignUpNavigation}
                    className={`flex-1 border-b-2 pb-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                      }`}>
                    <Text
                      className={`text-center ${theme === 'dark' ? 'text-gray-500' : 'text-gray-700'
                        }`}>
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Input Fields */}
                <View className="mb-4">
                  <View className="relative mb-4">
                    <View className="absolute top-3 left-3 z-10">
                      <FontAwesome
                        name="phone"
                        size={20}
                        color={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                      />
                    </View>
                    <TextInput
                      placeholder="Phone Number"
                      placeholderTextColor={
                        theme === 'dark' ? '#9CA3AF' : '#6B7280'
                      }
                      className={`rounded-lg px-10 py-3 ${theme === 'dark'
                        ? 'bg-gray-700 text-gray-100'
                        : 'bg-gray-200 text-gray-900'
                        }`}
                      value={formData.phoneNumber}
                      onChangeText={phoneNumber =>
                        setFormData({ ...formData, phoneNumber: phoneNumber })
                      }
                    />
                  </View>
                  <View className="relative mb-4">
                    <View className="absolute top-3 left-3 z-10">
                      <FontAwesome
                        name="envelope"
                        size={20}
                        color={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                      />
                    </View>
                    <TextInput
                      placeholder="Email"
                      placeholderTextColor={
                        theme === 'dark' ? '#9CA3AF' : '#6B7280'
                      }
                      className={`rounded-lg px-10 py-3 ${theme === 'dark'
                        ? 'bg-gray-700 text-gray-100'
                        : 'bg-gray-200 text-gray-900'
                        }`}
                      value={formData.email}
                      onChangeText={email =>
                        setFormData({ ...formData, email: email })
                      }
                    />
                  </View>
                  <View className="relative mb-4">
                    <View className="absolute top-3 left-3 z-10">
                      <FontAwesome
                        name="lock"
                        size={20}
                        color={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                      />
                    </View>
                    <TextInput
                      placeholder="Password"
                      placeholderTextColor={
                        theme === 'dark' ? '#9CA3AF' : '#6B7280'
                      }
                      secureTextEntry
                      className={`rounded-lg px-10 py-3 ${theme === 'dark'
                        ? 'bg-gray-700 text-gray-100'
                        : 'bg-gray-200 text-gray-900'
                        }`}
                      value={formData.password}
                      onChangeText={password =>
                        setFormData({ ...formData, password: password })
                      }
                    />
                  </View>
                </View>

                {/* Remember Me & Forgot Password */}
                <View className="flex-row justify-between items-center mb-6">
                  <View className="flex-row items-center">
                    <TouchableOpacity
                      className={`w-5 h-5 rounded border mr-2 ${theme === 'dark'
                        ? 'bg-gray-700 border-gray-600'
                        : 'bg-gray-200 border-gray-400'
                        }`}
                    />
                    <Text
                      className={
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }>
                      Remember me
                    </Text>
                  </View>
                  <TouchableOpacity>
                    <Text className="text-[#16BC88]">Forgot Password?</Text>
                  </TouchableOpacity>
                </View>

                {/* Sign In Button */}
                <TouchableOpacity
                  onPress={handleSignIn}
                  className="bg-[#16BC88] rounded py-3 items-center">
                  <Text className="text-white font-medium">Sign In</Text>
                </TouchableOpacity>
              </View>

              {/* Or Sign In With */}
              <SignInOptions />

              {/* Categories */}
              <Categories />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CustomerSignInScreen;
