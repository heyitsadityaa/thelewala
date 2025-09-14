import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import {
  UserIcon,
  ShoppingBagIcon,
  StarIcon,
  PencilIcon,
  EnvelopeIcon,
  PhoneIcon,
  HomeIcon,
  ClockIcon,
  MapPinIcon,
  CreditCardIcon,
  QuestionMarkCircleIcon,
  BellIcon,
  ShieldCheckIcon,
  LanguageIcon,
  ChevronRightIcon,
  ArrowRightOnRectangleIcon,
} from 'react-native-heroicons/outline';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../../global';
import axios from 'axios';
import {HOST_URL} from '@env';
import {CustomerAuthContext} from '../../context/CustomerAuthContext';
import {getLocationText} from '../../services/locationtext';

const avatar1 = require('../../assets/images/vendorstore.png');

type CustomerData = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  orders?: number;
  points?: number;
  favorites?: number;
};

const CustomerProfileScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const authContext = useContext(CustomerAuthContext);
  const [userData, setUserData] = useState<CustomerData>({});
  const [isLoading, setIsLoading] = useState(true);
  // const locationText = await getLocationText(longitude, latitude);

  const fetchCustomerData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${HOST_URL}/user/customer/me`, {
        headers: {
          Authorization: `Bearer ${authContext?.userToken}`,
        },
      });
      const user = response.data;
      setUserData(user);
    } catch (error) {
      console.error('Error fetching customer data:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchCustomerData();
  }, []);

  return (
    <ScrollView className="flex-1 bg-light-background dark:bg-dark-background">
      {/* {isLoading ? (
      <View className="flex-1 justify-center items-center py-20">
        <ActivityIndicator size="large" color="#22c55e" />
        <Text className="mt-4 text-light-textSecondary dark:text-dark-textSecondary">
          Loading profile...
        </Text>
      </View>
    ) : ( */}
      <View className="px-6 py-8">
        {/* Profile Info */}
        <View className="items-center mb-6">
          <View className="relative w-24 h-24 mb-4">
            <Image
              source={avatar1}
              className="w-24 h-24 rounded-full border border-emerald-500"
            />
            <View className="absolute right-0 bottom-0 bg-light-card dark:bg-dark-card p-1 rounded-full shadow">
              <TouchableOpacity>
                <PencilIcon size={20} color="#22c55e" />
              </TouchableOpacity>
            </View>
          </View>

          <Text className="text-2xl font-bold mb-1 text-light-text dark:text-dark-text">
            {userData?.firstName
              ? `${userData.firstName} ${userData.lastName || ''}`
              : 'Loading...'}
          </Text>
          <Text className="text-light-textSecondary dark:text-dark-textSecondary mb-3">
            Food enthusiast & adventurous eater
          </Text>

          <TouchableOpacity className="bg-emerald-500 py-2 px-6 rounded-full">
            <Text className="text-white font-medium">Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Personal Information */}
        <View className="rounded-lg p-4 mb-6 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-light-text dark:text-dark-text">
              Personal Information
            </Text>
            <TouchableOpacity>
              <PencilIcon size={20} color="#22c55e" />
            </TouchableOpacity>
          </View>

          {[
            {icon: EnvelopeIcon, text: userData?.email || 'No email provided'},
            {
              icon: PhoneIcon,
              text:
                `(+91) ${userData?.phoneNumber}` || 'No phone number provided',
            },
            {icon: HomeIcon, text: userData?.address || 'No address provided'},
          ].map((item, index) => (
            <View key={index} className="flex-row items-center mb-2">
              <item.icon size={20} color="#22c55e" className="mr-3" />
              <Text className="ml-2 text-light-text dark:text-dark-text">
                {item.text}
              </Text>
            </View>
          ))}
        </View>

        {/* Settings */}
        <View className="rounded-lg overflow-hidden mb-6 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border">
          <TouchableOpacity
            onPress={() => navigation.navigate('CustomerSettingScreen')}
            className="flex-row items-center justify-between p-4 border-b border-light-border dark:border-dark-border">
            <View className="flex-row items-center">
              <ShieldCheckIcon size={20} color="#22c55e" className="mr-3" />
              <Text className="ml-2 text-light-text dark:text-dark-text">
                Settings
              </Text>
            </View>
            <ChevronRightIcon size={18} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('CustomerSettingScreen')}
            className="flex-row items-center justify-between p-4 border-b border-light-border dark:border-dark-border">
            <View className="flex-row items-center">
              <QuestionMarkCircleIcon
                size={20}
                color="#22c55e"
                className="mr-3"
              />
              <Text className="ml-2 text-light-text dark:text-dark-text">
                Help & Support
              </Text>
            </View>
            <ChevronRightIcon size={18} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-light-border dark:border-dark-border">
            <View className="flex-row items-center">
              <LanguageIcon size={20} color="#22c55e" className="mr-3" />
              <Text className="ml-2 text-light-text dark:text-dark-text">
                Language
              </Text>
            </View>
            <Text className="text-light-textSecondary dark:text-dark-textSecondary">
              English
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="items-center space-y-4">
          <TouchableOpacity
            onPress={() => authContext?.signOut()}
            className="bg-red-100 py-3 px-8 rounded-full">
            <Text className="text-red-600 font-medium">Log Out</Text>
          </TouchableOpacity>
          <Text className="text-light-textSecondary dark:text-dark-textSecondary text-sm">
            Version 0.0.2
          </Text>
        </View>
      </View>
      {/* )} */}
    </ScrollView>
  );
};

export default CustomerProfileScreen;
