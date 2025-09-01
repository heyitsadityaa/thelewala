import React from 'react';
import {
  View,
  Text,
  Image,
  useColorScheme,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import {BellSlashIcon} from 'react-native-heroicons/outline';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {unsubscribeFromVendor} from '../../redux/slices/subscriptionSlice';

const CustomerSubscribedScreen = () => {
  const dispatch = useAppDispatch();
  const subscribedVendors = useAppSelector(
    state => state.subscriptions.subscribedVendors,
  );

  const handleUnsubscribe = (vendorId: string) => {
    dispatch(unsubscribeFromVendor(vendorId));
    ToastAndroid.showWithGravity(
      'Unsubscribed the vendor!',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
    );
  };

  if (subscribedVendors.length === 0) {
    return (
      <>
        <Text className="text-lg font-bold text-gray-900 dark:text-white text-center py-4 bg-light-background dark:bg-dark-background border-b border-light-border dark:border-dark-border">
          Subscribed
        </Text>
        <View className="flex-1 bg-light-background dark:bg-dark-background justify-center items-center">
          <BellSlashIcon size={64} color="#9CA3AF" />
          <Text className="text-lg text-light-textSecondary dark:text-dark-textSecondary mt-4">
            No subscriptions yet
          </Text>
          <Text className="text-sm text-light-textSecondary dark:text-dark-textSecondary text-center mt-2 px-8">
            Subscribe to vendors from the home screen to see them here
          </Text>
        </View>
      </>
    );
  }

  return (
    <ScrollView className="flex-1 bg-light-background dark:bg-dark-background">
      <Text className="text-lg font-bold text-gray-900 dark:text-white text-center py-4 bg-light-background dark:bg-dark-background border-b border-light-border dark:border-dark-border">
        Subscribed
      </Text>
      <View className="flex-1 p-4">
        {subscribedVendors.map(data => (
          <View
            key={data.id}
            className="flex-row items-center p-4 rounded-lg shadow-sm mb-3 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border">
            <Image
              source={{uri: data.imageUrl}}
              className="w-12 h-12 rounded-full"
            />
            <View className="flex-1 ml-3">
              <View className="flex-row justify-between items-center">
                <Text className="font-bold text-base text-light-text dark:text-dark-text">
                  {data.name}
                </Text>
                <Text className="text-light-textSecondary dark:text-dark-textSecondary text-xs">
                  {data.distance}
                </Text>
              </View>
              <Text className="text-light-textSecondary dark:text-dark-textSecondary text-sm">
                {data.description}
              </Text>
              <View className="mt-2 px-3 py-1 bg-green-900 rounded-full self-start">
                <Text className="text-green-300 text-xs font-semibold">
                  Subscribed {data.subscribed}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => handleUnsubscribe(data.id)}
              className="border border-emerald-500 px-3 py-1 rounded-full">
              <Text className="text-emerald-500 text-xs font-semibold">
                Unsubscribe
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default CustomerSubscribedScreen;
