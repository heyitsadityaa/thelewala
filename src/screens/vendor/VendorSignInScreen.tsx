import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  useColorScheme,
} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {VendorAuthContext} from '../../context/VendorAuthContext';
import {RootStackParamList} from '../../../global';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

interface VendorSignInScreenProps {
  setUserType: React.Dispatch<
    React.SetStateAction<'vendor' | 'customer' | null | undefined>
  >;
  userType: 'vendor' | 'customer' | null | undefined;
}

const VendorSignInScreen: React.FC<VendorSignInScreenProps> = ({
  setUserType,
  userType,
}) => {
  const theme = useColorScheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const authContext = useContext(VendorAuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // If user is already authenticated or token was refreshed, navigate to LandingScreen
  useEffect(() => {
    if (authContext?.userToken) {
      navigation.navigate('VendorHomeScreen');
    }
  }, [authContext?.userToken, navigation]);

  const handleSignIn = async () => {
    if (email.trim() === '' || password.trim() === '') {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    console.log('Signing in...', {userType});
    await authContext?.signIn(email, password);
    // signIn in VendorAuthContext should handle token refresh if expired
  };

  const handleSignUpNavigation = () => {
    navigation.navigate('VendorSignUpScreen');
  };

  return (
    <ScrollView className="flex-1 bg-light-background dark:bg-dark-background">
      {/* Header */}
      <View className="h-16 px-4 flex-row items-center justify-between border-b border-light-border dark:border-dark-border">
        <Text className="text-2xl">
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
        </Text>
        <TouchableOpacity
          onPress={handleSignUpNavigation}
          className="flex-row space-x-4">
          <Text className="text-sm text-light-textSecondary dark:text-dark-textSecondary font-medium">
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View className="p-4">
        {/* Hero Image */}
        <View className="h-48 rounded-lg overflow-hidden">
          <Image
            source={require('../../assets/images/vendorSignin.png')}
            className="w-[350px] h-[200px] rounded-lg"
            resizeMode="contain"
          />
        </View>

        {/* Sign In Form */}
        <View className="mt-6">
          <View>
            <Text className="text-2xl font-semibold text-light-text dark:text-dark-text">
              Welcome Back!
            </Text>
            <Text className="mt-2 text-sm text-light-textSecondary dark:text-dark-textSecondary">
              Sign in to manage your business on Thelewala
            </Text>
          </View>

          {/* Form Fields */}
          <View className="my-4">
            {/* Email Input */}
            <View className="relative my-4">
              <View className="absolute top-3 left-3 z-10">
                <FontAwesome
                  name="envelope"
                  size={20}
                  color={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                />
              </View>
              <TextInput
                placeholder="Business Email"
                className="w-full h-12 px-10 bg-light-input dark:bg-dark-input border border-light-border dark:border-dark-border rounded-lg text-light-text dark:text-dark-text"
                placeholderTextColor={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Password Input */}
            <View className="relative">
              <View className="absolute top-3 left-3 z-10">
                <FontAwesome
                  name="lock"
                  size={20}
                  color={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                />
              </View>
              <TextInput
                placeholder="Password"
                secureTextEntry
                className="w-full h-12 px-10 bg-light-input dark:bg-dark-input border border-light-border dark:border-dark-border rounded-lg text-light-text dark:text-dark-text"
                placeholderTextColor={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                value={password}
                onChangeText={setPassword}
              />
            </View>

            {/* Remember Me & Forgot Password */}
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center mx-2 my-6">
                <View className="w-4 h-4 border border-light-border dark:border-dark-border rounded" />
                <Text className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                  {' '}
                  Remember me
                </Text>
              </View>
              <TouchableOpacity>
                <Text className="text-sm text-emerald-500">
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              onPress={handleSignIn}
              className="w-full h-11 bg-emerald-500 rounded justify-center items-center">
              <Text className="text-white font-medium">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Features Section */}
        <View className="flex-row justify-center items-center mt-6">
          {[
            {icon: 'shield', label: 'Secure Payments'},
            {icon: 'phone', label: '24/7 Support'},
            {icon: 'users', label: '10k+ Vendors'},
          ].map((item, index) => (
            <View key={index} className="items-center mx-3 my-2">
              <FontAwesome
                name={item.icon}
                size={24}
                color={theme === 'dark' ? '#9CA3AF' : '#4B5563'}
              />
              <Text className="mt-2 text-xs text-light-textSecondary dark:text-dark-textSecondary">
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default VendorSignInScreen;
