import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  useColorScheme,
  ToastAndroid,
} from 'react-native';
import {
  NavigationProp,
  useNavigation,
  RouteProp,
  useRoute,
} from '@react-navigation/native';
import {RootStackParamList} from '../../../global';
import {CustomerAuthContext} from '../../context/CustomerAuthContext';
import {
  ArrowLeftIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  StarIcon,
} from 'react-native-heroicons/outline';
import {StarIcon as StarIconSolid} from 'react-native-heroicons/solid';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {
  subscribeToVendor,
  unsubscribeFromVendor,
} from '../../redux/slices/subscriptionSlice';
import {HOST_URL} from '@env';
import axios from 'axios';
import AppLoadScreen from '../AppLoadScreen';

type VendorDetailScreenProps = {
  vendorId: string;
  businessName: string;
  contactPerson: string;
  description?: string;
  distance?: string;
};

type VendorItem = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  available: boolean;
};

const VendorDetailScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route =
    useRoute<RouteProp<{params: VendorDetailScreenProps}, 'params'>>();

  // Access route params correctly
  const {vendorId} = route.params;

  const authContext = useContext(CustomerAuthContext);
  const theme = useColorScheme();
  const dispatch = useAppDispatch();
  const subscribedVendors = useAppSelector(
    state => state.subscriptions.subscribedVendors,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Mock vendor data - replace with actual API call
  const [vendorData, setVendorData] = useState({
    vendorId: route.params?.vendorId || 'vendor_123',
    businessName: route.params?.businessName || 'Fresh Fruits & Vegetables',
    contactPerson: route.params?.contactPerson || 'John Smith',
    description:
      route.params?.description ||
      'We provide fresh, organic fruits and vegetables sourced directly from local farms. Quality guaranteed!',
    distance: route.params?.distance || '2.5 km',
    phone: '+1 (555) 123-4567',
    email: 'contact@freshfruits.com',
    openingHours: '8:00 AM - 8:00 PM',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
  });

  // Mock items data - replace with actual API call
  const [vendorItems, setVendorItems] = useState<VendorItem[]>([
    {
      id: '1',
      name: 'Fresh Apples',
      price: 3.99,
      description: 'Crispy red apples, perfect for snacking',
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200',
      category: 'Fruits',
      available: true,
    },
    {
      id: '2',
      name: 'Organic Bananas',
      price: 2.49,
      description: 'Sweet, ripe bananas grown organically',
      image:
        'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200',
      category: 'Fruits',
      available: true,
    },
    {
      id: '3',
      name: 'Fresh Carrots',
      price: 1.99,
      description: 'Crunchy orange carrots, great for cooking',
      image:
        'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=200',
      category: 'Vegetables',
      available: false,
    },
    {
      id: '4',
      name: 'Spinach Leaves',
      price: 2.99,
      description: 'Fresh green spinach, rich in iron',
      image:
        'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=200',
      category: 'Vegetables',
      available: true,
    },
  ]);

  // Update fetchCustomerData to use the vendorId from params
  const fetchVendorData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${HOST_URL}/vendor/${vendorId}`, {
        headers: {
          Authorization: `Bearer ${authContext?.userToken}`,
        },
      });
      const vendor = response.data;
      console.log(vendor);
      setVendorData(vendor);
    } catch (error) {
      console.error('Error fetching vendor data:', error);
      // Keep using route params as fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (vendorId) {
      fetchVendorData();
    }
  }, [vendorId]);

  const isSubscribed = subscribedVendors.some(
    vendor => vendor.id === vendorData.vendorId,
  );

  const handleSubscribe = () => {
    if (isSubscribed) {
      dispatch(unsubscribeFromVendor(vendorData.vendorId));
      ToastAndroid.showWithGravity(
        'Unsubscribed',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    } else {
      const vendorSubscriptionData = {
        id: vendorData.vendorId,
        name: vendorData.businessName,
        distance: vendorData.distance,
        description: vendorData.description,
        imageUrl: vendorData.image,
        subscribed: new Date().toLocaleDateString(),
      };

      dispatch(subscribeToVendor(vendorSubscriptionData));
      ToastAndroid.showWithGravity(
        'Subscribed',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    }
  };

  if (isLoading) {
    return <AppLoadScreen />;
  }

  if (!vendorData) {
    return 'No vendor Data';
  }
  return (
    <SafeAreaView className="flex-1 bg-light-background dark:bg-dark-background">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="flex-row items-center">
          <ArrowLeftIcon
            size={24}
            color={theme === 'dark' ? '#F9FAFB' : '#111827'}
          />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-light-text dark:text-dark-text">
          Vendor Details
        </Text>
        <View className="w-6" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Vendor Image */}
        <View className="h-48 w-full">
          <Image
            source={{uri: vendorData.image}}
            className="w-full h-full"
            resizeMode="cover"
          />
          {/* Overlay for subscribe button */}
        </View>

        {/* Vendor Info */}
        <View className="px-4 py-6 bg-light-card dark:bg-dark-card border-b border-light-border dark:border-dark-border">
          {/* Business Name */}
          <View className="flex-row justify-between items-start mb-2">
            <Text className="text-2xl font-bold text-light-text dark:text-dark-text flex-1">
              {vendorData.businessName}
            </Text>
            <View>
              <TouchableOpacity
                onPress={handleSubscribe}
                className={`px-6 py-2 rounded-full ${
                  isSubscribed ? 'bg-gray-500' : 'bg-emerald-500'
                }`}>
                <Text className="text-white font-medium">
                  {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Contact Person */}
          <Text className="text-lg text-light-textSecondary dark:text-dark-textSecondary mb-2">
            Contact: {vendorData.contactPerson}
          </Text>

          {/* Distance */}
          <View className="flex-row items-center mb-4">
            <MapPinIcon
              size={16}
              color={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
            />
            <Text className="text-sm text-light-textSecondary dark:text-dark-textSecondary ml-1">
              {vendorData.distance} away
            </Text>
          </View>

          {/* Description */}
          <Text className="text-base text-light-text dark:text-dark-text leading-6">
            {vendorData.description}
          </Text>
        </View>

        {/* Contact Information */}
        <View className="px-4 py-6 bg-light-card dark:bg-dark-card border-b border-light-border dark:border-dark-border">
          <Text className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
            Contact Information
          </Text>

          {/* Phone */}
          <View className="flex-row items-center mb-3">
            <PhoneIcon
              size={20}
              color={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
            />
            <Text className="text-base text-light-text dark:text-dark-text ml-3">
              {vendorData.phone}
            </Text>
          </View>

          {/* Email */}
          <View className="flex-row items-center mb-3">
            <EnvelopeIcon
              size={20}
              color={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
            />
            <Text className="text-base text-light-text dark:text-dark-text ml-3">
              {vendorData.email}
            </Text>
          </View>

          {/* Address */}
          <View className="flex-row items-center mb-3">
            <MapPinIcon
              size={20}
              color={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
            />
          </View>

          {/* Opening Hours */}
          <View className="flex-row items-center">
            <ClockIcon
              size={20}
              color={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
            />
            <Text className="text-base text-light-text dark:text-dark-text ml-3">
              {vendorData.openingHours}
            </Text>
          </View>
        </View>

        {/* Items Section */}
        <View className="px-4 py-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-semibold text-light-text dark:text-dark-text">
              Available Items
            </Text>
            <Text className="text-emerald-500 font-medium">
              {vendorItems.filter(item => item.available).length} items
            </Text>
          </View>

          {/* Items Grid */}
          <View className="space-y-4">
            {vendorItems.map((item, index) => (
              <View
                key={item.id}
                className={`rounded-lg p-4 border ${
                  item.available
                    ? 'bg-light-card dark:bg-dark-card border-light-border dark:border-dark-border'
                    : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                }`}>
                <View className="flex-row">
                  <Image
                    source={{uri: item.image}}
                    className="w-16 h-16 rounded-lg mr-4"
                  />
                  <View className="flex-1">
                    <View className="flex-row justify-between items-start mb-1">
                      <Text
                        className={`text-lg font-semibold ${
                          item.available
                            ? 'text-light-text dark:text-dark-text'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                        {item.name}
                      </Text>
                      <Text
                        className={`text-lg font-bold ${
                          item.available
                            ? 'text-emerald-500'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                        ${item.price}
                      </Text>
                    </View>
                    <Text
                      className={`text-sm mb-2 ${
                        item.available
                          ? 'text-light-textSecondary dark:text-dark-textSecondary'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                      {item.description}
                    </Text>
                    <View className="flex-row justify-between items-center">
                      <Text
                        className={`text-xs px-2 py-1 rounded-full ${
                          item.available
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                            : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                        }`}>
                        {item.category}
                      </Text>
                      <Text
                        className={`text-sm font-medium ${
                          item.available ? 'text-emerald-500' : 'text-red-500'
                        }`}>
                        {item.available ? 'Available' : 'Out of Stock'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom Spacing */}
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default VendorDetailScreen;
