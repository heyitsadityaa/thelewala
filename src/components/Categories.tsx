import React from 'react';
import {View, Text, Image, useColorScheme} from 'react-native';

const Categories = () => {
  const theme = useColorScheme();
  return (
    <View className="flex-row justify-between">
      <View className="items-center">
        <View
          className={`w-[70px] h-[70px] rounded-lg overflow-hidden mb-2 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
          }`}>
          <Image
            source={require('../assets/images/food.png')}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
        <Text
          className={
            theme === 'dark' ? 'text-gray-400 text-xs' : 'text-gray-600 text-xs'
          }>
          Food
        </Text>
      </View>
      <View className="items-center">
        <View
          className={`w-[70px] h-[70px] rounded-lg overflow-hidden mb-2 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
          }`}>
          <Image
            source={require('../assets/images/goods.png')}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
        <Text
          className={
            theme === 'dark' ? 'text-gray-400 text-xs' : 'text-gray-600 text-xs'
          }>
          Goods
        </Text>
      </View>
      <View className="items-center">
        <View
          className={`w-[70px] h-[70px] rounded-lg overflow-hidden mb-2 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
          }`}>
          <Image
            source={require('../assets/images/essentials.png')}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
        <Text
          className={
            theme === 'dark' ? 'text-gray-400 text-xs' : 'text-gray-600 text-xs'
          }>
          Essentials
        </Text>
      </View>
      <View className="items-center">
        <View
          className={`w-[70px] h-[70px] rounded-lg overflow-hidden mb-2 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
          }`}>
          <Image
            source={require('../assets/images/services.png')}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
        <Text
          className={
            theme === 'dark' ? 'text-gray-400 text-xs' : 'text-gray-600 text-xs'
          }>
          Services
        </Text>
      </View>
    </View>
  );
};

export default Categories;
