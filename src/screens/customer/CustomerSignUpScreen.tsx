import React, {useContext, useEffect, useState} from 'react';
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
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../../global';
import {CustomerAuthContext} from '../../context/CustomerAuthContext';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Categories from '../../components/Categories';
import SignInOptions from '../../components/SignInOptions';

interface CustomerSignUpScreenProps {
  setUserType: React.Dispatch<
    React.SetStateAction<'vendor' | 'customer' | null | undefined>
  >;
  userType: 'vendor' | 'customer' | null | undefined;
}

const CustomerSignUpScreen: React.FC<CustomerSignUpScreenProps> = ({
  setUserType,
  userType,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const authContext = useContext(CustomerAuthContext);
  const theme = useColorScheme();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
  });

  // If user is already authenticated or token was refreshed, navigate to CustomerHomeScreen
  useEffect(() => {
    if (authContext?.userToken) {
      navigation.navigate('CustomerHomeScreen');
    }
  }, [authContext?.userToken, navigation]);

  // Change function name to handleSignUp
  const handleSignUp = async () => {
    if (
      formData.firstName === '' ||
      formData.lastName === '' ||
      formData.email === '' ||
      formData.password === '' ||
      formData.phoneNumber === ''
    ) {
      Alert.alert('Error', 'Please enter required fields line59');
      return;
    }

    // if (formData.createPassword !== formData.confirmPassword) {
    //   Alert.alert('Error', 'Passwords do not match.');
    //   return;
    // }

    try {
      console.log('Signing up...', {userType});

      await authContext?.signUp(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.phoneNumber,
        formData.password,
      );

      // console.log(
      //   formData.email,
      //   formData.confirmPassword,
      //   firstName,
      //   lastName,
      // );
    } catch (error) {
      console.log('Signup', error);
    }
    // Optionally update user type after sign in:
    // setUserType('customer')
  };

  // New function to handle navigation to the sign up screen
  const handleSignInNavigation = () => {
    navigation.navigate('CustomerSignInScreen');
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView
      className={`flex-1 bg-light-background dark:bg-dark-background`}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <ScrollView className="flex-1">
            <View className="p-5 flex-1">
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
                  className={`text-xl font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                  Welcome!
                </Text>
                <Text
                  className={`text-sm text-center ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                  Sign up with your phone number, email, or social accounts to
                  explore our marketplace of local goods and services.
                </Text>
              </View>

              {/* Auth Container */}
              <View
                className={`rounded-lg p-6 mb-8 ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                }`}>
                {/* Toggle Buttons */}
                <View className="flex-row mb-6">
                  <View
                    className={`flex-1 border-b-2 pb-2 ${
                      theme === 'dark' ? 'border-[#16BC88]' : 'border-[#16BC88]'
                    }`}>
                    <Text
                      className={`text-center font-medium ${
                        theme === 'dark' ? 'text-[#16BC88]' : 'text-[#16BC88]'
                      }`}>
                      Sign Up
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={handleSignInNavigation}
                    className={`flex-1 border-b-2 pb-2 ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                    }`}>
                    <Text
                      className={`text-center ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-700'
                      }`}>
                      Sign In
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Input Fields */}
                <View className="mb-4">
                  <View className="relative mb-4">
                    <View className="absolute top-3 left-3 z-10">
                      <FontAwesome
                        name="user"
                        size={20}
                        color={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                      />
                    </View>
                    <TextInput
                      placeholder="First Name"
                      placeholderTextColor={
                        theme === 'dark' ? '#9CA3AF' : '#6B7280'
                      }
                      value={formData.firstName}
                      onChangeText={firstName =>
                        setFormData({...formData, firstName: firstName})
                      }
                      className={`rounded-lg px-10 py-3 ${
                        theme === 'dark'
                          ? 'bg-gray-700 text-gray-100'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    />
                  </View>
                  <View className="relative mb-4">
                    <View className="absolute top-3 left-3 z-10">
                      <FontAwesome
                        name="user"
                        size={20}
                        color={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                      />
                    </View>
                    <TextInput
                      placeholder="Last name"
                      placeholderTextColor={
                        theme === 'dark' ? '#9CA3AF' : '#6B7280'
                      }
                      value={formData.lastName}
                      onChangeText={lastName =>
                        setFormData({...formData, lastName: lastName})
                      }
                      className={`rounded-lg px-10 py-3 ${
                        theme === 'dark'
                          ? 'bg-gray-700 text-gray-100'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    />
                  </View>
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
                      value={formData.phoneNumber}
                      onChangeText={phoneNumber =>
                        setFormData({...formData, phoneNumber: phoneNumber})
                      }
                      className={`rounded-lg px-10 py-3 ${
                        theme === 'dark'
                          ? 'bg-gray-700 text-gray-100'
                          : 'bg-gray-200 text-gray-900'
                      }`}
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
                      className={`rounded-lg px-10 py-3 ${
                        theme === 'dark'
                          ? 'bg-gray-700 text-gray-100'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                      value={formData.email}
                      onChangeText={email =>
                        setFormData({...formData, email: email})
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
                      value={formData.password}
                      onChangeText={password =>
                        setFormData({...formData, password: password})
                      }
                      secureTextEntry
                      className={`rounded-lg px-10 py-3 ${
                        theme === 'dark'
                          ? 'bg-gray-700 text-gray-100'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    />
                  </View>
                </View>

                {/* Sign Up Button */}
                <TouchableOpacity
                  className="bg-[#16BC88] rounded py-3 items-center"
                  onPress={handleSignUp}>
                  <Text className="text-white font-medium">Sign Up</Text>
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

export default CustomerSignUpScreen;
