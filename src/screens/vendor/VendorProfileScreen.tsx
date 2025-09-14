import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  SafeAreaView,
  useColorScheme,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {VendorAuthContext} from '../../context/VendorAuthContext';
import {HOST_URL} from '@env';
import axios from 'axios';
import AppLoadScreen from '../AppLoadScreen';
import {Picker} from '@react-native-picker/picker';

const vendorCoverImg = require('../../assets/images/vendorCoverImg.png');
const vendorProfileImg = require('../../assets/images/vendorProfileImg.png');
const vendorItemImg1 = require('../../assets/images/vendorItemImg1.png');
const vendorItemImg2 = require('../../assets/images/vendorItemImg2.png');

enum BusinessCategory {
  Bakery = 'Bakery',
  Restaurant = 'Restaurant',
  Grocery = 'Grocery',
  Clothing = 'Clothing',
  Electronics = 'Electronics',
  Other = 'Other',
}

enum OpeningHours {
  Morning = 'Morning',
  Afternoon = 'Afternoon',
  Evening = 'Evening',
  Night = 'Night',
}

type VendorData = {
  businessName?: string;
  contactPerson?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  confirmPassword?: string;
  businessCategory?: BusinessCategory; // Enum
  businessAddress?: string;
  aboutUs?: string;
  openingHours?: OpeningHours; // Enum
  verified?: boolean;
  rating?: string;
  featuredItems?: [];
  reviews?: [];
};

const VendorProfileScreen = () => {
  const theme = useColorScheme();
  const isDark = theme === 'dark';
  const authContext = useContext(VendorAuthContext);
  const [userData, setUserData] = useState<VendorData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [editedAboutText, setEditedAboutText] = useState('');
  const [selectedOpeningHours, setSelectedOpeningHours] =
    useState<OpeningHours | null>(null);

  const fetchCustomerData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${HOST_URL}/user/vendor/me`, {
        headers: {
          Authorization: `Bearer ${authContext?.userToken}`,
        },
      });
      const user = response.data;

      setUserData(user);
    } catch (error) {
      console.error('Error fetching vendor data:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // console.log(authContext?.userToken);
  const saveAboutChanges = () => {
    // Handle saving the changes here
    setUserData({...userData, aboutUs: editedAboutText});
    setIsEditingAbout(false);
  };

  useEffect(() => {
    fetchCustomerData();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-light-background dark:bg-dark-background">
      {/* Header */}
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme === 'dark' ? '#1F2937' : '#ffffff'}
      />
      <View className="w-full backdrop-blur-sm bg-light-background dark:bg-dark-background border-b border-light-border dark:border-dark-border">
        <View className="flex-row justify-center items-center px-4 py-4">
          <Text className="text-lg text-light-text dark:text-dark-text font-semibold">
            Profile
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Cover Image and Profile Picture */}
        <View className="w-full h-[200px] relative">
          <Image source={vendorCoverImg} className="w-full h-full" />
          <View className="absolute -bottom-16 left-[30%] w-[128px] h-[128px] rounded-full border-4 border-emerald-500 overflow-hidden">
            <Image source={vendorProfileImg} className="w-[120px] h-[120px]" />
          </View>
        </View>

        {/* Main Content */}
        <View className="px-2 mt-20">
          <View className="relative">
            {/* Bakery Info */}
            <View className="px-2">
              <View className="mb-4">
                <Text className="text-2xl font-bold text-center text-light-text dark:text-dark-text">
                  {userData.businessName}
                </Text>
                <Text className="text-center text-light-textSecondary dark:text-dark-textSecondary">
                  {userData.contactPerson}
                </Text>

                <View className="flex-row justify-center items-center mt-2">
                  <View className="flex-row items-center mr-4">
                    <Icon name="checkmark-circle" color="green" size={20} />
                    <Text className="ml-2 text-light-text dark:text-dark-text">
                      {userData.verified ? 'Verified' : 'Not Verified'}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Icon name="star" color="gold" size={20} />
                    <Text className="ml-2 text-light-text dark:text-dark-text">
                      {userData.rating || `No rating`}
                    </Text>
                  </View>
                </View>
              </View>

              {/* About Us */}
              <View className="mb-4 bg-light-card dark:bg-dark-card rounded-xl p-4 border border-light-border dark:border-dark-border">
                <Text className="text-xl font-semibold mb-2 text-light-text dark:text-dark-text">
                  About Us
                </Text>
                {isEditingAbout ? (
                  <View>
                    <TextInput
                      className="border border-light-border dark:border-dark-border p-2 rounded-lg mb-2 text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background"
                      multiline
                      numberOfLines={4}
                      value={editedAboutText}
                      onChangeText={setEditedAboutText}
                      placeholder="Tell customers about your business..."
                      placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                    />
                    <View className="flex-row justify-end mt-2">
                      <TouchableOpacity
                        className="bg-gray-300 dark:bg-gray-600 p-2 rounded-lg mr-2"
                        onPress={() => {
                          setIsEditingAbout(false);
                          setEditedAboutText(userData?.aboutUs || '');
                        }}>
                        <Text className="text-light-text dark:text-dark-text">
                          Cancel
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="bg-green-500 p-2 rounded-lg"
                        onPress={saveAboutChanges}>
                        <Text className="text-white">Save</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <Text className="text-light-textSecondary dark:text-dark-textSecondary">
                    {userData?.aboutUs || 'You have not added anything yet.'}
                  </Text>
                )}
                {!isEditingAbout && (
                  <TouchableOpacity
                    className="absolute bottom-3 right-3 bg-green-500 p-2 rounded-full"
                    onPress={() => {
                      setEditedAboutText(userData?.aboutUs || '');
                      setIsEditingAbout(true);
                    }}>
                    <Icon name="pencil" size={18} color="#fff" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Details */}
              <View className="flex-row justify-between mb-4 bg-light-card dark:bg-dark-card rounded-xl p-4 border border-light-border dark:border-dark-border">
                <View className="flex-row items-center">
                  <Icon
                    name="time"
                    size={20}
                    color={isDark ? '#fff' : '#374151'}
                  />
                  <View className="ml-2">
                    <Text className="text-light-text dark:text-dark-text mb-2 mt-4">
                      Select Opening Hours:
                    </Text>
                    <Picker
                      selectedValue={selectedOpeningHours}
                      onValueChange={itemValue =>
                        setSelectedOpeningHours(itemValue)
                      }
                      style={{
                        backgroundColor: isDark ? '#1F2937' : '#ffffff',
                        color: isDark ? '#ffffff' : '#000000',
                      }}>
                      {Object.values(OpeningHours).map(hours => (
                        <Picker.Item key={hours} label={hours} value={hours} />
                      ))}
                    </Picker>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View className="items-center mt-3 mb-4">
          <TouchableOpacity
            onPress={() => authContext?.signOut()}
            className="bg-red-100 py-3 px-8 rounded-full">
            <Text className="text-red-600 font-medium">Log Out</Text>
          </TouchableOpacity>
          <Text className="text-light-textSecondary dark:text-dark-textSecondary text-sm mt-2">
            Version 0.0.2
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VendorProfileScreen;
