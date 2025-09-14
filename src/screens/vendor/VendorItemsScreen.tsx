import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  useColorScheme,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {useAppSelector} from '../../redux/hooks';
import {RootStackParamList} from '../../../global';

const mapImage = require('../../assets/images/vendorstore.png');

const VendorItemsScreen = () => {
  const theme = useColorScheme();
  const isDarkMode = theme === 'dark';
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const items = useAppSelector(state => state.items.items);

  return (
    <SafeAreaView className="flex-1 bg-light-background dark:bg-dark-background">
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#1F2937' : '#ffffff'}
      />
      {/* Header */}
      <View className="w-full bg-light-background dark:bg-dark-background border-b border-light-border dark:border-dark-border">
        <View className="flex-row justify-between items-center px-4 py-4">
          <Text className="text-lg font-semibold text-light-text dark:text-dark-text">
            My Items
          </Text>
          <TouchableOpacity
            className="flex-row items-center bg-emerald-600 px-4 py-2 rounded-lg"
            onPress={() => navigation.navigate('AddItemsScreen')}>
            <Icon name="add" size={20} color="#fff" />
            <Text className="text-white ml-2 font-medium">Add Item</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Items List */}
      <ScrollView className="flex-1 px-4 pt-3">
        {items.length === 0 ? (
          <View className="flex-1 items-center justify-center mt-20">
            <Text className="text-light-textSecondary dark:text-dark-textSecondary text-lg">
              No items found. Tap "Add Item" to add your first item.
            </Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap justify-between">
            {items.map((item, index) => (
              <View
                key={item.id}
                className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-2xl overflow-hidden mb-4 w-[48%]">
                <Image
                  source={mapImage}
                  className="h-32 w-full"
                  resizeMode="cover"
                />
                <View className="p-3">
                  <Text className="text-lg font-semibold text-light-text dark:text-dark-text">
                    {item.name}
                  </Text>
                  <Text className="text-sm text-light-textSecondary dark:text-dark-textSecondary mb-2">
                    {item.category}
                  </Text>
                  <Text className="text-emerald-500 font-bold">
                    ₹{item.price}
                  </Text>
                  <Text className="text-xs text-light-textSecondary dark:text-dark-textSecondary mt-1">
                    Stock: {item.stock} {item.unit}
                  </Text>
                  {item.discount ? (
                    <Text className="text-xs text-emerald-600 mt-1">
                      Discount: {item.discount}%
                    </Text>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default VendorItemsScreen;
