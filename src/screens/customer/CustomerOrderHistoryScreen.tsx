import React from 'react';
import {
  View,
  Text,
  Image,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';

const CustomerOrderHistoryScreen = () => {
  const theme = useColorScheme();
  const isDarkMode = theme === 'dark';

  const orderHistory = [
    {
      id: 1,
      name: 'Fresh Bites Kitchen',
      date: 'March 10, 2025',
      total: '$15.99',
      imageUrl: 'https://example.com/freshbites.jpg',
    },
    {
      id: 2,
      name: 'Spice Market',
      date: 'March 8, 2025',
      total: '$22.49',
      imageUrl: 'https://example.com/spicemarket.jpg',
    },
    {
      id: 3,
      name: 'Green Bowl',
      date: 'March 5, 2025',
      total: '$12.75',
      imageUrl: 'https://example.com/greenbowl.jpg',
    },
  ];

  return (
    <View className="flex-1 bg-light-background dark:bg-dark-background">
      <Text className="text-lg text-center h-16 font-semibold mb-4 text-light-text dark:text-dark-text border-b border-light-border dark:border-dark-border w-full p-4">
        Order History
      </Text>

      <View className="px-4">
        {orderHistory.map(order => (
          <TouchableOpacity
            key={order.id}
            className="flex-row items-center rounded-lg shadow-sm mb-3 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border px-4 py-3">
            <Image
              source={{uri: order.imageUrl}}
              className="w-12 h-12 rounded-full"
            />
            <View className="flex-1 ml-3">
              <Text className="font-bold text-base text-light-text dark:text-dark-text">
                {order.name}
              </Text>
              <Text className="text-light-textSecondary dark:text-dark-textSecondary text-sm">
                {order.date}
              </Text>
            </View>
            <Text className="text-sm font-semibold text-light-text dark:text-dark-text">
              {order.total}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default CustomerOrderHistoryScreen;
