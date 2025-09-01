import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  ToastAndroid,
  Keyboard,
} from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../global';
import { CustomerAuthContext } from '../../context/CustomerAuthContext';
import { MapPinIcon } from 'react-native-heroicons/outline';
import { SERVER_URL, MAPBOX_ACCESSSTOKEN, HOST_URL } from '@env';
import Mapbox, {
  Camera,
  Images,
  LocationPuck,
  MapView,
  ShapeSource,
  SymbolLayer,
} from '@rnmapbox/maps';
import Geolocation from 'react-native-geolocation-service';
import { getLocationText } from '../../services/locationtext';
import { io, Socket } from 'socket.io-client';
import { featureCollection, point } from '@turf/helpers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  subscribeToVendor,
  unsubscribeFromVendor,
} from '../../redux/slices/subscriptionSlice';
import axios from 'axios';
import AppLoadScreen from '../AppLoadScreen';
const pin = require('../../assets/images/pin.png');

Mapbox.setAccessToken(MAPBOX_ACCESSSTOKEN);

type userData = {
  coordinates: [string, string];
  businessName: string;
  contactPerson: string;
  distance: string;
  vendorId: string;
};

const CustomerHomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const authContext = useContext(CustomerAuthContext);
  const theme = useColorScheme();
  const dispatch = useAppDispatch();
  const subscribedVendors = useAppSelector(
    state => state.subscriptions.subscribedVendors,
  );

  const [currentLocation, setCurrentLocation] = useState<[number, number]>([
    0, 0,
  ]);

  const [locationText, setLocationText] = useState('Fetching location...');
  const [searchOrders, setSearchOrders] = useState('');
  const [userData, setUserData] = useState<userData[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const fetchCurrentLocation = async () => {
    Geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation([longitude, latitude]);
        const locationText = await getLocationText(longitude, latitude);
        setLocationText(locationText);
      },
      error => {
        console.error('Error getting location:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  const socketRef = useRef<Socket | null>(null);

  const connectToServer = () => {
    if (socketRef.current?.connected) {
      console.log('Socket already connected');
      return () => { };
    }

    const socket = io(SERVER_URL, {
      transports: ['websocket'],
      extraHeaders: {
        Authorization: `Bearer ${authContext?.userToken}`,
      },
    });
    socketRef.current = socket;

    socket.on('welcome', (data: { message: string; clientId: string }) => {
      console.log('Server says:', data.message);
      console.log('My client ID is:', data.clientId);
    });

    socket.on('nearbyVendorsUpdate', data => {
      const { nearbyVendors } = data;

      // Now you can use nearbyCustomers and throttle here
      console.log('nearbyVendors', nearbyVendors);
      setUserData(nearbyVendors);
      console.log('userData', userData);
    });

    return () => {
      socket.disconnect();
    };
  };

  const sendCustomerUpdates = (latitude: number, longitude: number) => {
    if (!authContext?.userToken)
      return 'No userToken found while sending customer updates.';

    const payload = {
      event: 'customerPeriodicUpdates',
      data: { longitude, latitude },
    };

    socketRef.current?.emit('customerPeriodicUpdates', payload);
  };

  const addAddress = async () => {
    try {
      setIsLoading(true);

      // Validate required data before making request
      if (!authContext?.userToken) {
        console.error('No user token available');
        ToastAndroid.showWithGravity(
          'Authentication required. Please sign in again.',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );
        return;
      }

      if (!locationText || locationText === 'Fetching location...') {
        console.error('Location not available yet');
        return; // Don't show error, just wait for location
      }

      if (currentLocation[0] === 0 && currentLocation[1] === 0) {
        console.error('Invalid coordinates');
        return; // Don't show error, just wait for valid location
      }

      console.log('Sending address data:', {
        address: locationText,
        latitude: currentLocation[1],
        longitude: currentLocation[0],
        userToken: authContext?.userToken ? 'Present' : 'Missing',
        endpoint: `${HOST_URL}/customer/address`,
      });

      const response = await axios.post(
        `${HOST_URL}/customer/address`,
        {
          address: locationText,
          latitude: currentLocation[1], // latitude is index 1
          longitude: currentLocation[0], // longitude is index 0
        },
        {
          headers: {
            Authorization: `Bearer ${authContext?.userToken}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000, // 10 second timeout
        }
      );

      console.log('Address saved successfully:', response.data);
      ToastAndroid.showWithGravity(
        'Location saved successfully',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );

    } catch (error: any) {
      console.error('Address save error:', error);

      if (error.response) {
        // Server responded with error status
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);

        const errorMessage = error.response.data?.message ||
          error.response.data?.error ||
          `Server error: ${error.response.status}`;

        ToastAndroid.showWithGravity(
          errorMessage,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request);
        ToastAndroid.showWithGravity(
          'Network error. Please check your connection.',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );
      } else {
        // Something else happened
        console.error('Request setup error:', error.message);
        ToastAndroid.showWithGravity(
          'Failed to save location. Please try again.',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  // Add separate useEffect to handle address saving when location is ready
  useEffect(() => {
    const saveAddressWhenReady = async () => {
      if (currentLocation[0] !== 0 && currentLocation[1] !== 0 &&
        locationText && locationText !== 'Fetching location...' &&
        authContext?.userToken) {
        await addAddress();
      }
    };

    saveAddressWhenReady();
  }, [currentLocation, locationText, authContext?.userToken]);

  useEffect(() => {
    const setup = async () => {
      try {
        // First, get the location
        await fetchCurrentLocation();

        // Setup socket connection
        const disconnect = connectToServer();

        // Send initial location update
        Geolocation.getCurrentPosition(
          async position => {
            const { latitude, longitude } = position.coords;
            sendCustomerUpdates(latitude, longitude);
          },
          error => {
            console.error('Error getting location for socket update:', error);
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
          },
        );

        return () => {
          disconnect();
        };
      } catch (error) {
        console.error('Setup error:', error);
      }
    };

    setup();
  }, []);

  if (!userData) {
    return <Text>No userData</Text>;
  }

  if (isLoading) {
    return <AppLoadScreen />
  }

  console.log(userData);

  const points = userData.map(item => {
    return point([
      parseFloat(item.coordinates[0]),
      parseFloat(item.coordinates[1]),
    ]);
  });

  const onPointPress = async () => { };

  const handleSubscribeToVendor = (vendorId: string, index: number) => {
    const isAlreadySubscribed = subscribedVendors.some(
      vendor => vendor.id === vendorId,
    );

    if (isAlreadySubscribed) {
      ToastAndroid.showWithGravity(
        'Already subscribed to this vendor',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
      return;
    }

    const currentVendor = userData[index];
    const vendorData = {
      id: currentVendor.vendorId,
      name: currentVendor.businessName,
      distance: currentVendor.distance,
      description: `Vendor managed by ${currentVendor.contactPerson}`,
      imageUrl: 'https://dummyimage.com/64x64/000/fff',
      subscribed: new Date().toLocaleDateString(),
    };

    dispatch(subscribeToVendor(vendorData));

    ToastAndroid.showWithGravity(
      'Successfully subscribed to vendor!',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
    );
  };

  const handleUnsubscribeFromVendor = (vendorId: string) => {
    dispatch(unsubscribeFromVendor(vendorId));

    ToastAndroid.showWithGravity(
      'Successfully unsubscribed from vendor!',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
    );
  };

  return (
    <View className="flex-1 bg-light-background dark:bg-dark-background">
      {/* Header */}
      <View className="h-[55px] shadow-sm bg-light-card dark:bg-dark-card">
        <View className="flex-row items-center justify-between px-4 h-[50px]">
          <View className="flex-row items-center space-x-2">
            <MapPinIcon
              color={theme === 'dark' ? '#F9FAFB' : '#111827'}
              size={24}
            />
            <Text className="text-lg font-semibold text-light-text dark:text-dark-text">
              {locationText}
            </Text>
          </View>
          {/* <TouchableOpacity>
              <AdjustmentsHorizontalIcon
                color={theme === 'dark' ? '#F9FAFB' : '#111827'}
                size={24}
              />
            </TouchableOpacity> */}
        </View>

        {/* Search Bar */}
        {/* <View className="flex-row items-center px-4">
            <View className="flex-1 flex-row items-center py-1 rounded-lg bg-light-input dark:bg-dark-input">
              <View className="ml-4 flex flex-row items-center">
                <MagnifyingGlassIcon
                  color={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                  size={14}
                />
                <TextInput
                  onChangeText={order => setSearchOrders(order)}
                  value={searchOrders}
                  placeholder="Search vendors"
                  keyboardType="default"
                  className="text-sm text-light-textSecondary dark:text-dark-textSecondary"
                />
              </View>
            </View>
          </View> */}
      </View>

      {/* Map */}
      <View className="h-[45%] w-full bg-gray-100">
        <MapView
          style={{ flex: 1 }}
          styleURL={
            theme === 'dark'
              ? 'mapbox://styles/mapbox/navigation-night-v1'
              : 'mapbox://styles/mapbox/navigation-day-v1'
          }>
          <Camera
            zoomLevel={13}
            centerCoordinate={currentLocation}
            animationMode="flyTo"
          />
          <LocationPuck
            puckBearingEnabled={true}
            puckBearing="heading"
            pulsing={{ isEnabled: true }}
          />
          <ShapeSource
            id="customers"
            cluster
            shape={featureCollection(points)}
            onPress={onPointPress}>
            <SymbolLayer
              id="customers-icons"
              style={{
                iconImage: 'pin',
                iconSize: 0.5,
                iconAllowOverlap: true,
                iconAnchor: 'bottom',
              }}
            />
            <Images images={{ pin }} />
          </ShapeSource>
        </MapView>
      </View>

      {/* Nearby Vendors Section */}
      <View className="flex-1 px-4 mt-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-semibold text-light-text dark:text-dark-text">
            Nearby Vendors
          </Text>
          {/* <TouchableOpacity>
              <Text className="text-emerald-500 text-md">View All</Text>
            </TouchableOpacity> */}
        </View>

        {/* Scrollable Vendor Cards */}
        {userData.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-lg text-light-textSecondary dark:text-dark-textSecondary text-center">
              No vendors nearby
            </Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            {userData.map((item, index) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('VendorDetailScreen', {
                    vendorId: item.vendorId,
                  })
                }
                key={index}
                className="w-full rounded-lg shadow-sm p-4 mb-4 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border">
                <View className="flex-row">
                  <Image
                    source={{ uri: 'https://dummyimage.com/64x64/000/fff' }}
                    className="w-16 h-16 rounded-lg mr-3"
                  />
                  <View className="flex-1">
                    <View className="flex-row justify-between items-center mb-2">
                      <Text className="text-sm font-semibold text-light-text dark:text-dark-text">
                        {item.businessName}
                      </Text>
                      <Text className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                        {Math.floor(parseInt(item.distance))} km
                      </Text>
                    </View>
                    <Text className="text-sm mb-2 text-light-textSecondary dark:text-dark-textSecondary">
                      by {item.contactPerson}
                    </Text>
                    {subscribedVendors.some(
                      vendor => vendor.id === item.vendorId,
                    ) ? (
                      <TouchableOpacity
                        onPress={() =>
                          handleUnsubscribeFromVendor(item.vendorId)
                        }
                        className="bg-red-500 w-[40%] rounded-md px-4 py-2">
                        <Text className="text-white text-sm text-center">
                          Unsubscribe
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() =>
                          handleSubscribeToVendor(item.vendorId, index)
                        }
                        className="bg-emerald-500 w-1/3 rounded-md px-4 py-2">
                        <Text className="text-white text-sm text-center">
                          Subscribe
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default CustomerHomeScreen;
