import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
} from 'react-native';
import Mapbox, {
  Camera,
  Images,
  LineLayer,
  LocationPuck,
  MapView,
  ShapeSource,
  SymbolLayer,
} from '@rnmapbox/maps';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/FontAwesome';
import { VendorAuthContext } from '../../context/VendorAuthContext';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../global';
import { SERVER_URL, MAPBOX_ACCESSSTOKEN, HOST_URL } from '@env';
import { io, Socket } from 'socket.io-client';
import { OnPressEvent } from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
import { featureCollection, point } from '@turf/helpers';
import { getDirection } from '../../services/direction';
import AppLoadScreen from '../AppLoadScreen';
import { useAppSelector } from '../../redux/hooks';
import axios from 'axios';

const logo = require('../../assets/images/logo.png');
const pin = require('../../assets/images/pin.png');
const redpin = require('../../assets/images/redpin.png');
const bluepin = require('../../assets/images/bluepin.png');

Mapbox.setAccessToken(MAPBOX_ACCESSSTOKEN);

interface DirectionResponse {
  routes: {
    geometry: {
      coordinates: number[][];
    };
  }[];
}

// ✅ Add these interfaces at the top (replace existing complex ones)
interface CustomerAddress {
  id: string;
  address: string;
  coordinate: [number, number]; // [longitude, latitude]
  createdAt: string;
}

interface CustomerData {
  customerId: string;
  customerName: string;
  addresses: CustomerAddress[];
}

interface CustomerLocationResponse {
  vendorId: string;
  customers: CustomerData[];
  totalCustomers: number;
  totalAddresses: number;
  timestamp: string;
}

interface ApiResponse {
  success: boolean;
  data: CustomerLocationResponse;
}

const VendorLandingScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const theme = useColorScheme();
  const [currentLocation, setCurrentLocation] = useState<[number, number]>([
    0, 0,
  ]);
  const [direction, setDirection] = useState<DirectionResponse | undefined>(
    undefined,
  );
  const [isSellingActive, setIsSellingActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const authContext = useContext(VendorAuthContext);
  const currentItem = useAppSelector(state => state.items.items);

  // ✅ Simple state for customer coordinates
  const [customerCoordinates, setCustomerCoordinates] = useState<[number, number][]>([]);

  const directionCoordinate = direction?.routes?.[0]?.geometry.coordinates;

  const onPointPress = async (event: OnPressEvent) => {
    const newDirection = await getDirection(
      [currentLocation[0], currentLocation[1]],
      [event.coordinates.longitude, event.coordinates.latitude],
    );
    setDirection(newDirection);
  };

  const fetchCurrentLocation = async () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation([longitude, latitude]);
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

  // ✅ Simple API call to get coordinates
  const fetchCustomerLocations = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching customer locations...');

      const response = await axios.get<ApiResponse>(
        `${HOST_URL}/vendor/address/customer-locations`,
        {
          headers: {
            Authorization: `Bearer ${authContext?.userToken}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        },
      );

      console.log('Customer locations response:', response.data);

      if (response.data.success && response.data.data.customers.length > 0) {
        // ✅ Extract just the coordinates from the response
        const coordinates: [number, number][] = [];

        response.data.data.customers.forEach(customer => {
          customer.addresses.forEach(address => {
            // coordinate is [longitude, latitude] from your API
            coordinates.push([address.coordinate[0], address.coordinate[1]]);
          });
        });

        setCustomerCoordinates(coordinates);
        console.log('Customer coordinates:', coordinates);

      } else {
        setCustomerCoordinates([]);
        console.log('No customers found');
      }
    } catch (error: any) {
      console.error('Error fetching customer locations:', error);
      setCustomerCoordinates([]);
    } finally {
      setIsLoading(false);
    }
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

    return () => {
      socket.disconnect();
    };
  };

  const sendVendorUpdates = (latitude: number, longitude: number) => {
    if (!authContext?.userToken)
      return 'No userToken found while sending vendor updates.';

    const payload = {
      event: 'vendorPeriodicUpdates',
      data: { longitude, latitude },
    };

    socketRef.current?.emit('vendorPeriodicUpdates', payload);
  };

  // ✅ Updated start selling to fetch API data
  const startSelling = async (latitude: number, longitude: number) => {
    if (!authContext?.userToken) {
      console.log('No userToken found');
      return;
    }

    if (!latitude || !longitude) {
      console.log('No latitude and longitude available');
      return;
    }

    setIsSellingActive(true);

    // ✅ Fetch customer locations from API
    await fetchCustomerLocations();

    const payload = {
      event: 'startSelling',
      data: { longitude, latitude },
    };

    socketRef.current?.emit('startSelling', payload);
    sendVendorUpdates(latitude, longitude);
  };

  // ✅ Updated stop selling to clear data
  const stopSelling = (latitude: number, longitude: number) => {
    if (!authContext?.userToken) {
      console.log('No userToken found');
      return;
    }

    setIsSellingActive(false);

    // ✅ Clear customer coordinates
    setCustomerCoordinates([]);

    const payload = {
      event: 'stopSelling',
      data: { latitude, longitude },
    };

    socketRef.current?.emit('stopSelling', payload);
  };

  const toggleSelling = () => {
    if (isSellingActive) {
      stopSelling(currentLocation[1], currentLocation[0]);
    } else {
      startSelling(currentLocation[1], currentLocation[0]);
    }
  };

  useEffect(() => {
    fetchCurrentLocation();
    const disconnect = connectToServer();

    return () => {
      disconnect();
    };
  }, []);

  useEffect(() => {
    let watchId: number;

    if (isSellingActive) {
      watchId = Geolocation.watchPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation([longitude, latitude]);
          sendVendorUpdates(latitude, longitude);
        },
        error => {
          console.error('Watch position error:', error);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 10,
        },
      );
    }

    return () => {
      if (watchId) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, [isSellingActive]);

  // ✅ Show loading screen
  if (isLoading) {
    return <AppLoadScreen />;
  }

  // ✅ Create map points from customer coordinates
  const customerPoints = customerCoordinates.map(coord =>
    point([coord[0], coord[1]]) // [longitude, latitude]
  );

  console.log('currentLocation', currentLocation);
  console.log('customerCoordinates:', customerCoordinates);
  console.log('customerPoints:', customerPoints);

  return (
    <View className="flex-1 bg-light-background dark:bg-dark-background">
      {/* Header */}
      <View className="border-b border-light-border dark:border-dark-border px-4 py-3">
        <View className="flex-row items-center justify-between">
          <Image
            source={
              theme === 'dark'
                ? require('../../assets/images/logodark.png')
                : logo
            }
            className="w-28 h-10"
            resizeMode="contain"
          />
          <View className="flex-row space-x-5">
            <TouchableOpacity className="relative">

            </TouchableOpacity>
            {/* ✅ Add refresh button when selling */}
            {isSellingActive && (
              <TouchableOpacity onPress={fetchCustomerLocations}>
                <Icon
                  name="refresh"
                  size={22}
                  color={theme === 'dark' ? '#F9FAFB' : '#374151'}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
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
            zoomLevel={12}
            centerCoordinate={currentLocation}
            animationMode="flyTo"
          />
          <LocationPuck
            puckBearingEnabled={true}
            puckBearing="heading"
            pulsing={{ isEnabled: true }}
          />

          {/* ✅ Simple customer pins - only show when selling and have coordinates */}
          {isSellingActive && customerPoints.length > 0 && (
            <ShapeSource
              id="customers"
              shape={featureCollection(customerPoints)}
              onPress={onPointPress}>
              <SymbolLayer
                id="customer-icons"
                style={{
                  iconImage: 'pin',
                  iconSize: 0.5,
                  iconAllowOverlap: true,
                  iconAnchor: 'bottom',
                }}
              />
              <Images images={{ pin }} />
            </ShapeSource>
          )}

          {directionCoordinate && (
            <ShapeSource
              id="routeSource"
              lineMetrics
              shape={{
                properties: {},
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: directionCoordinate,
                },
              }}>
              <LineLayer
                id="exampleLineLayer"
                style={{
                  lineColor: '#42E100',
                  lineCap: 'round',
                  lineJoin: 'round',
                  lineWidth: 7,
                }}
              />
            </ShapeSource>
          )}
        </MapView>
      </View>

      {/* Content ScrollView */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="px-4 mb-2">
          <View className="flex-row justify-between my-4">
            {['Customer Locations', 'Active items'].map((title, index) => (
              <TouchableOpacity
                key={index}
                className="items-start bg-light-card dark:bg-dark-card p-4 rounded-2xl border border-light-border dark:border-dark-border flex-1 mx-1">
                <Text className="text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary">
                  {title}
                </Text>
                <Text className="font-bold text-left text-light-text dark:text-dark-text text-xl">
                  {index === 0 ? customerCoordinates.length : currentItem.length}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Start/Stop Selling Button */}
        <View className="px-4 mb-4">
          <TouchableOpacity
            className={`p-4 rounded-2xl border ${isSellingActive
              ? 'bg-red-500 border-red-600'
              : 'bg-green-500 border-green-600'
              }`}
            onPress={toggleSelling}
            disabled={isLoading}>
            <Text className="text-white text-center text-lg font-semibold">
              {isLoading
                ? 'Loading...'
                : isSellingActive
                  ? 'Stop Selling'
                  : 'Start Selling'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ✅ Simple status display */}
        <View className="px-4 mb-4">
          <Text className="text-xl font-bold text-light-text dark:text-dark-text mb-2">
            Status
          </Text>

          <View className="bg-light-card dark:bg-dark-card p-4 rounded-xl border border-light-border dark:border-dark-border">
            {!isSellingActive ? (
              <Text className="text-light-textSecondary dark:text-dark-textSecondary text-center">
                Press "Start Selling" to load and display customer locations on map
              </Text>
            ) : customerCoordinates.length === 0 ? (
              <Text className="text-light-textSecondary dark:text-dark-textSecondary text-center">
                No customer locations found with addresses
              </Text>
            ) : (
              <Text className="text-light-text dark:text-dark-text text-center">
                📍 Displaying {customerCoordinates.length} customer location{customerCoordinates.length > 1 ? 's' : ''} on map
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default VendorLandingScreen;
