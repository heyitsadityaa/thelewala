import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  SafeAreaView,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../../global';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {VendorAuthContext} from '../../context/VendorAuthContext';

interface VendorSignUpScreenProps {
  setUserType: React.Dispatch<
    React.SetStateAction<'vendor' | 'customer' | null | undefined>
  >;
  userType: 'vendor' | 'customer' | null | undefined;
}

const VendorSignUpScreen: React.FC<VendorSignUpScreenProps> = ({
  setUserType,
  userType,
}) => {
  const theme = useColorScheme();
  const [formData, setFormData] = useState({
    businessName: '',
    contactPerson: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    businessCategory: '',
    businessAddress: '',
    agreeToTerms: false,
  });
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const authContext = useContext(VendorAuthContext);

  // If user is already authenticated, navigate to LandingScreen
  useEffect(() => {
    if (authContext?.userToken) {
      navigation.navigate('VendorHomeScreen');
    }
  }, [authContext?.userToken, navigation]);

  const handleSignUp = async () => {
    if (
      formData.businessName === '' ||
      formData.contactPerson === '' ||
      formData.email === '' ||
      formData.phoneNumber === '' ||
      formData.password === '' ||
      formData.confirmPassword === '' ||
      formData.businessCategory === '' ||
      formData.businessAddress === ''
    ) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      console.log('Signing up...', {userType});
      const fullName = formData.contactPerson.trim();
      const nameParts = fullName.split(' ');

      if (nameParts.length < 2) {
        Alert.alert('Error', 'Please enter both first and last name');
        return;
      }

      await authContext?.signUp(
        formData.businessName,
        formData.contactPerson,
        formData.email,
        formData.phoneNumber,
        formData.confirmPassword,
        formData.password,
        formData.businessAddress,
        formData.businessCategory,
      );
    } catch (error) {
      console.log('Signup error:', error);
      Alert.alert('Error', 'Failed to sign up. Please try again.');
    }
  };

  // Function to handle navigation to the sign in screen
  const handleSignInNavigation = () => {
    navigation.navigate('VendorSignInScreen');
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView className="flex-1 bg-light-background dark:bg-dark-background">
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
        enabled>
        <ScrollView className="flex-1">
          {/* Header */}
          <View className="px-4 py-3 border-b border-light-border dark:border-dark-border">
            <View className="flex-row justify-between items-center">
              <Text className="text-2xl text-emerald-500">
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
              <TouchableOpacity onPress={handleSignInNavigation}>
                <Text className="text-light-textSecondary dark:text-dark-textSecondary">
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Form Content */}

          <View className="p-4">
            <View className="h-48 rounded-lg overflow-hidden">
              <Image
                source={require('../../assets/images/vendorSignup.png')}
                className="w-[350px] h-[200px] rounded-lg"
                resizeMode="contain"
              />
            </View>
            <Text className="text-2xl font-semibold my-2 text-light-text dark:text-dark-text">
              Join Our Vendor Community
            </Text>
            <Text className="text-light-textSecondary dark:text-dark-textSecondary mb-2">
              Start growing your business and connect with your local community
              today
            </Text>

            {/* Form Fields */}
            <View className="my-4">
              {/* Business Name */}
              <View className="relative mb-4">
                <Text className="text-sm font-medium text-light-text dark:text-dark-text mb-1">
                  Business Name
                </Text>
                <View className="absolute top-9 left-3 z-10">
                  <FontAwesome
                    name="building"
                    size={20}
                    color={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                  />
                </View>
                <TextInput
                  className="w-full h-12 pl-10 pr-3 border border-light-border dark:border-dark-border rounded-lg text-light-text dark:text-dark-text bg-light-input dark:bg-dark-input"
                  placeholder="Your Business name"
                  placeholderTextColor={
                    theme === 'dark' ? '#9CA3AF' : '#6B7280'
                  }
                  value={formData.businessName}
                  onChangeText={name =>
                    setFormData({...formData, businessName: name})
                  }
                />
              </View>

              {/* Contact Person */}
              <View className="relative mb-4">
                <Text className="text-sm font-medium text-light-text dark:text-dark-text mb-1">
                  Contact Person
                </Text>
                <View className="absolute top-9 left-3 z-10">
                  <FontAwesome
                    name="user"
                    size={20}
                    color={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                  />
                </View>
                <TextInput
                  className="w-full h-12 pl-10 pr-3 border border-light-border dark:border-dark-border rounded-lg text-light-text dark:text-dark-text bg-light-input dark:bg-dark-input"
                  placeholder="Your full name"
                  value={formData.contactPerson}
                  placeholderTextColor={
                    theme === 'dark' ? '#9CA3AF' : '#6B7280'
                  }
                  onChangeText={text =>
                    setFormData({...formData, contactPerson: text})
                  }
                />
              </View>

              {/* Email */}
              <View className="relative mb-4">
                <Text className="text-sm font-medium text-light-text dark:text-dark-text mb-1">
                  Email
                </Text>
                <View className="absolute top-9 left-3 z-10">
                  <FontAwesome
                    name="envelope"
                    size={20}
                    color={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                  />
                </View>
                <TextInput
                  className="w-full h-12 pl-10 pr-3 border border-light-border dark:border-dark-border rounded-lg text-light-text dark:text-dark-text bg-light-input dark:bg-dark-input"
                  placeholder="your@email.com"
                  placeholderTextColor={
                    theme === 'dark' ? '#9CA3AF' : '#6B7280'
                  }
                  keyboardType="email-address"
                  value={formData.email}
                  onChangeText={text => setFormData({...formData, email: text})}
                />
              </View>

              {/* Phone Number */}
              <View className="relative mb-4">
                <Text className="text-sm font-medium text-light-text dark:text-dark-text mb-1">
                  Phone Number
                </Text>
                <View className="absolute top-9 left-3 z-10">
                  <FontAwesome
                    name="phone"
                    size={20}
                    color={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                  />
                </View>
                <TextInput
                  className="w-full h-12 pl-10 pr-3 border border-light-border dark:border-dark-border rounded-lg text-light-text dark:text-dark-text bg-light-input dark:bg-dark-input"
                  placeholder="+1 (555) 000-0000"
                  keyboardType="phone-pad"
                  value={formData.phoneNumber}
                  placeholderTextColor={
                    theme === 'dark' ? '#9CA3AF' : '#6B7280'
                  }
                  onChangeText={text =>
                    setFormData({...formData, phoneNumber: text})
                  }
                />
              </View>

              {/* Password */}
              <View className="relative mb-4">
                <Text className="text-sm font-medium text-light-text dark:text-dark-text mb-1">
                  Password
                </Text>
                <View className="absolute top-9 left-3 z-10">
                  <FontAwesome
                    name="lock"
                    size={20}
                    color={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                  />
                </View>
                <TextInput
                  className="w-full h-12 pl-10 pr-3 border border-light-border dark:border-dark-border rounded-lg text-light-text dark:text-dark-text bg-light-input dark:bg-dark-input"
                  placeholder="Create password"
                  secureTextEntry
                  placeholderTextColor={
                    theme === 'dark' ? '#9CA3AF' : '#6B7280'
                  }
                  value={formData.password}
                  onChangeText={text =>
                    setFormData({...formData, password: text})
                  }
                />
              </View>

              {/* Confirm Password */}
              <View className="relative mb-4">
                <Text className="text-sm font-medium text-light-text dark:text-dark-text mb-1">
                  Confirm Password
                </Text>
                <View className="absolute top-9 left-3 z-10">
                  <FontAwesome
                    name="lock"
                    size={20}
                    color={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                  />
                </View>
                <TextInput
                  className="w-full h-12 pl-10 pr-3 border border-light-border dark:border-dark-border rounded-lg text-light-text dark:text-dark-text bg-light-input dark:bg-dark-input"
                  placeholder="Confirm password"
                  secureTextEntry
                  placeholderTextColor={
                    theme === 'dark' ? '#9CA3AF' : '#6B7280'
                  }
                  value={formData.confirmPassword}
                  onChangeText={text =>
                    setFormData({...formData, confirmPassword: text})
                  }
                />
              </View>

              {/* Business Category */}
              <View className="relative mb-4">
                <Text className="text-sm font-medium text-light-text dark:text-dark-text mb-1">
                  Business Category
                </Text>
                <View className="absolute top-9 left-3 z-10">
                  <FontAwesome
                    name="building"
                    size={20}
                    color={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                  />
                </View>
                <TextInput
                  placeholder="Type category"
                  placeholderTextColor={
                    theme === 'dark' ? '#9CA3AF' : '#6B7280'
                  }
                  value={formData.businessCategory}
                  onChangeText={text =>
                    setFormData({...formData, businessCategory: text})
                  }
                  className="w-full h-12 pl-10 pr-3 border border-light-border dark:border-dark-border rounded-lg text-light-text dark:text-dark-text bg-light-input dark:bg-dark-input"></TextInput>
              </View>

              {/* Business Address */}
              <View className="relative mb-2">
                <Text className="text-sm font-medium text-light-text dark:text-dark-text mb-1">
                  Business Address
                </Text>
                <View className="absolute top-9 left-3 z-10">
                  <FontAwesome
                    name="map-marker"
                    size={20}
                    color={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                  />
                </View>
                <TextInput
                  className="w-full h-12 pl-10 pr-3 border border-light-border dark:border-dark-border rounded-lg text-light-text dark:text-dark-text bg-light-input dark:bg-dark-input"
                  placeholder="Enter your business address"
                  placeholderTextColor={
                    theme === 'dark' ? '#9CA3AF' : '#6B7280'
                  }
                  value={formData.businessAddress}
                  onChangeText={text =>
                    setFormData({...formData, businessAddress: text})
                  }
                />
              </View>

              {/* Terms and Conditions */}
              <View className="flex-row items-start space-x-2 mt-4">
                <TouchableOpacity
                  onPress={() =>
                    setFormData({
                      ...formData,
                      agreeToTerms: !formData.agreeToTerms,
                    })
                  }
                  className="w-6 h-6 border border-light-border dark:border-dark-border rounded mt-1 mr-3">
                  {formData.agreeToTerms && (
                    <View className="w-full h-full bg-emerald-500 items-center justify-center" />
                  )}
                </TouchableOpacity>
                <View className="flex-1">
                  <Text className="text-light-textSecondary dark:text-dark-textSecondary">
                    I agree to Thelewala's{' '}
                    <Text className="text-emerald-500">Terms & Conditions</Text>{' '}
                    and <Text className="text-emerald-500">Privacy Policy</Text>
                  </Text>
                </View>
              </View>

              {/* Create Account Button */}
              <TouchableOpacity
                onPress={handleSignUp}
                className="w-full bg-emerald-500 h-12 rounded justify-center items-center mt-4">
                <Text className="text-white font-medium">Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default VendorSignUpScreen;
