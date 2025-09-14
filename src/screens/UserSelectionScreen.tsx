import React, {useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  useColorScheme,
  PermissionsAndroid,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

interface UserRoleSelectionProps {
  userType: 'vendor' | 'customer' | null | undefined;
  setUserType: React.Dispatch<
    React.SetStateAction<'vendor' | 'customer' | null | undefined>
  >;
}

const statistics = [
  {number: '1000+', label: 'Active Vendors'},
  {number: '50k+', label: 'Happy Customers'},
  {number: '100+', label: 'Communities'},
  {number: '4.8', label: 'App Rating'},
];

const categories = [
  {name: 'Recycling'},
  {name: 'Food'},
  {name: 'Produce'},
  {name: 'Clothing'},
  {name: 'Daily Items'},
];

const UserRoleSelection: React.FC<UserRoleSelectionProps> = ({
  userType,
  setUserType,
}) => {
  const theme = useColorScheme();

  const handleVendorPress = () => {
    console.log('vendor button pressed');
    setUserType('vendor');
  };
  const handleCustomerPress = () => {
    console.log('customer pressed');
    setUserType('customer');
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Thelewala Location Permission',
          message: 'Thelewala needs access to your location ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location');
      } else {
        console.log('location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-light-background dark:bg-dark-background">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-4 pt-4 border-b border-light-border dark:border-dark-border ">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-2xl font-semibold text-emerald-500">
              <Image
                resizeMode="contain"
                source={
                  theme === 'dark'
                    ? require('../assets/images/logodark.png')
                    : require('../assets/images/logo.png')
                }
                alt="logo"
                className="w-28 h-10"
              />
            </Text>
            <TouchableOpacity className="flex-row items-center space-x-1">
              <FontAwesome
                name="globe"
                size={14}
                color="#4B5563"
                className="mr-1"
              />
              <Text className="text-light-textSecondary dark:text-dark-textSecondary">
                EN
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Role Selection Cards */}
        <View className="px-4 py-4">
          <Text className="text-light-textSecondary dark:text-dark-textSecondary mx-2 my-2">
            Choose how you want to start
          </Text>
          {/* Vendor Card */}
          <View className="bg-light-card dark:bg-dark-card rounded-lg p-4 shadow-md border border-light-border dark:border-dark-border mb-4">
            <Image
              source={require('../assets/images/UserSelectionVendorImage.png')}
              className="w-full h-48 rounded-lg mb-4"
            />
            <Text className="text-xl font-semibold mb-2 text-light-text dark:text-dark-text">
              Become a Vendor
            </Text>
            <Text className="text-light-textSecondary dark:text-dark-textSecondary mb-4">
              Join our growing community of 1000+ vendors and start your
              sustainable business journey today.
            </Text>
            <View className="space-y-2 mb-4">
              {[
                'Sell sustainable products',
                'Reach local customers',
                'Flexible scheduling',
              ].map((item, index) => (
                <View key={index} className="flex-row items-center space-x-2">
                  <FontAwesome name="check-circle" size={14} color="#10b981" />
                  <Text className="text-light-textSecondary dark:text-dark-textSecondary">
                    {' '}
                    {item}
                  </Text>
                </View>
              ))}
            </View>
            <TouchableOpacity
              className="bg-emerald-500 rounded py-3"
              onPress={handleVendorPress}>
              <Text className="text-white text-center font-medium">
                Get Started as Vendor
              </Text>
            </TouchableOpacity>
          </View>

          {/* Customer Card */}
          <View className="bg-light-card dark:bg-dark-card rounded-lg p-4 shadow-md border border-light-border dark:border-dark-border">
            <Image
              source={require('../assets/images/UserSelectionCustomerImage.png')}
              className="w-full h-48 rounded-lg mb-4"
            />
            <Text className="text-xl font-semibold mb-2 text-light-text dark:text-dark-text">
              Shop as Customer
            </Text>
            <Text className="text-light-textSecondary dark:text-dark-textSecondary mb-4">
              Discover amazing local products and support sustainable businesses
              in your community.
            </Text>
            <View className="space-y-2 mb-4">
              {[
                'Shop local products',
                'Support sustainability',
                'Easy ordering',
              ].map((item, index) => (
                <View key={index} className="flex-row items-center space-x-2">
                  <FontAwesome name="check-circle" size={14} color="#10b981" />
                  <Text className="text-light-textSecondary dark:text-dark-textSecondary">
                    {' '}
                    {item}
                  </Text>
                </View>
              ))}
            </View>
            <TouchableOpacity
              onPress={handleCustomerPress}
              className="bg-emerald-500 rounded py-3">
              <Text className="text-white text-center font-medium">
                Continue as Customer
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Statistics */}
        <View className="px-4 flex-row justify-between">
          {statistics.map((stat, index) => (
            <View key={index} className="items-center">
              <Text className="text-light-text dark:text-dark-text font-semibold">
                {stat.number}
              </Text>
              <Text className="text-light-textSecondary dark:text-dark-textSecondary text-xs">
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Categories */}
        <View className="px-4 py-6">
          <Text className="text-light-text dark:text-dark-text font-medium mb-4">
            Popular Categories
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="space-x-4">
            {categories.map((category, index) => (
              <View
                key={index}
                className={`items-center w-16 ${
                  index !== categories.length - 1 ? 'mr-6' : ''
                }`}>
                <View className="w-16 h-16 bg-gray-100 rounded-lg mb-2" />
                <Text className="text-xs text-center text-light-text dark:text-dark-text">
                  {category.name}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Footer */}
        <View className="px-4 pb-6">
          <View className="flex-row flex-wrap justify-between gap-2">
            {[
              {
                icon: (
                  <FontAwesome
                    name="question-circle"
                    size={14}
                    color="#4B5563"
                    className="mr-1"
                  />
                ),
                label: 'Support',
              },
              {
                icon: (
                  <FontAwesome
                    name="question-circle"
                    size={14}
                    color="#4B5563"
                    className="mr-1"
                  />
                ),
                label: 'Help Center',
              },
              {
                icon: (
                  <FontAwesome
                    name="users"
                    size={14}
                    color="#4B5563"
                    className="mr-1"
                  />
                ),
                label: 'Community',
              },
              {
                icon: (
                  <FontAwesome
                    name="shield"
                    size={14}
                    color="#4B5563"
                    className="mr-1"
                  />
                ),
                label: 'Safety',
              },
            ].map((item, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center justify-center space-x-2 border border-light-border dark:border-dark-border rounded-lg px-4 py-2 flex-1 min-w-[45%]">
                {item.icon}
                <Text className="text-light-textSecondary dark:text-dark-textSecondary">
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserRoleSelection;
