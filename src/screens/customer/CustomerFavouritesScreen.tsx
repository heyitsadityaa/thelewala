import React from 'react';
import {
  View,
  Text,
  Image,
  useColorScheme,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const CustomerFavouritesScreen = () => {
  const theme = useColorScheme();

  const favouriteRestaurants = [
    {
      id: 1,
      name: 'Cozy Corner Café',
      distance: '0.4 mi',
      description: 'A warm and friendly coffee shop',
      imageUrl: 'https://example.com/cozycorner.jpg',
      favourited: 'Favourited Today',
    },
    {
      id: 2,
      name: 'Sunset Diner',
      distance: '0.6 mi',
      description: 'Classic American comfort food',
      imageUrl: 'https://example.com/sunsetdiner.jpg',
      favourited: 'Favourited Today',
    },
    {
      id: 3,
      name: 'Bamboo Garden',
      distance: '0.9 mi',
      description: 'Authentic Asian cuisine',
      imageUrl: 'https://example.com/bamboogarden.jpg',
      favourited: 'Favourited Today',
    },
  ];

  return (
    <ScrollView className="flex-1 bg-light-background dark:bg-dark-background">
      <View className="flex-1 p-4">
        {favouriteRestaurants.map(data => (
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
              <View className="mt-2 px-3 py-1 bg-blue-900 rounded-full self-start">
                <Text className="text-blue-300 text-xs font-semibold">
                  {data.favourited}
                </Text>
              </View>
            </View>
            <TouchableOpacity className="border border-blue-500 px-3 py-1 rounded-full">
              <Text className="text-blue-500 text-xs font-semibold">
                Remove
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default CustomerFavouritesScreen;
