import React from 'react';
import {
  View,
  Text,
  Image,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const SignInOptions = () => {
  const theme = useColorScheme();
  return (
    <View className="items-center mb-8 mx-5">
      <Text className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
        Or sign in with
      </Text>
      <View className="flex flex-row justify-between w-full mt-4">
        <TouchableOpacity
          className={`${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
          } px-12 py-3 border border-gray-400 rounded-lg`}>
          <FontAwesome
            name="google"
            size={16}
            color={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          className={`${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
          } px-12 py-3 border border-gray-400 rounded-lg`}>
          <FontAwesome
            name="apple"
            size={16}
            color={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          className={`${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
          } px-12 py-3 border border-gray-400 rounded-lg`}>
          <FontAwesome
            name="facebook-f"
            size={16}
            color={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignInOptions;
