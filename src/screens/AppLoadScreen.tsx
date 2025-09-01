import React from 'react';
import {ActivityIndicator, Text, View} from 'react-native';

const AppLoadScreen = () => {
  return (
    <View className="flex-1 bg-light-background dark:bg-dark-background items-center justify-center">
      <ActivityIndicator size="large" color="#22C55E" />
      <Text className="dark:text-dark-text text-light-text mt-4 text-lg">
        Loading...
      </Text>
    </View>
  );
};

export default AppLoadScreen;
