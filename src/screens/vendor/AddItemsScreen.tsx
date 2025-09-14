import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
  useColorScheme,
  ToastAndroid,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {RootStackParamList} from '../../../global';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {addItem, updateCurrentItem} from '../../redux/slices/itemSlice';

const AddItemsScreen = () => {
  const dispatch = useAppDispatch();
  const currentItem = useAppSelector(state => state.items.currentItem);

  const handleAddItem = () => {
    try {
      dispatch(addItem());
      ToastAndroid.showWithGravity(
        'Item Added Successfully',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    } catch (error) {
      ToastAndroid.showWithGravity(
        'Failed to add item',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    }
  };
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [activeCategory, setActiveCategory] = useState('food');
  const [isVisible, setIsVisible] = useState(false);
  const theme = useColorScheme();

  const category = [
    {id: 'food', label: 'Food'},
    {id: 'dairy', label: 'Dairy'},
    {id: 'grocery', label: 'Grocery'},
    {id: 'daily', label: 'Daily'},
  ];

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView className="flex flex-col h-screen bg-light-background dark:bg-dark-background">
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        {/* Header */}
        <View className="w-full bg-light-background dark:bg-dark-background border-b border-light-border dark:border-dark-border">
          <View className="h-[60px] px-4 flex justify-center items-center">
            <Text className="text-[18px] font-medium text-light-text dark:text-dark-text">
              Add New Item
            </Text>
          </View>
        </View>

        {/* Main Content */}
        <ScrollView className="flex-1 px-4">
          {/* Image Upload */}
          {/* <View className="mt-4 h-[180px] w-full rounded-lg border-2 border-dashed border-light-border dark:border-dark-border bg-light-input dark:bg-dark-input p-6">
          <Text className="text-[14px] text-light-textSecondary dark:text-dark-textSecondary text-center">
            Upload Item Photo
          </Text>
          <Text className="text-[12px] text-light-textSecondary dark:text-dark-textSecondary text-center mt-2">
            Tap to upload or drag image here
          </Text>
        </View> */}

          {/* Form */}
          <View className="mt-6">
            {/* Item Name */}
            <View className="mb-5">
              <Text className="text-[14px] font-medium text-light-text dark:text-dark-text mb-1">
                Item Name
              </Text>
              <TextInput
                value={currentItem.name}
                onChangeText={text => dispatch(updateCurrentItem({name: text}))}
                className="h-11 px-4 rounded-lg bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text border border-light-border dark:border-dark-border"
                placeholder="Enter item name"
                placeholderTextColor={theme === 'dark' ? '#9CA3AF' : '#4B5563'}
              />
            </View>

            {/* Category */}
            <View className="mb-5">
              <Text className="text-[14px] font-medium text-light-text dark:text-dark-text mb-1">
                Category
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {category.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => setActiveCategory(item.id)}
                    className={`px-4 py-2 rounded-full border ${
                      activeCategory === item.id
                        ? 'bg-[#16BC88] border-transparent'
                        : 'bg-light-input dark:bg-dark-input border-light-border dark:border-dark-border'
                    }`}>
                    <Text
                      className={`${
                        activeCategory === item.id
                          ? 'text-white'
                          : 'text-light-text dark:text-dark-text'
                      }`}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Price */}
            <View className="mb-5">
              <Text className="text-[14px] font-medium text-light-text dark:text-dark-text mb-1">
                Price
              </Text>
              <View className="relative">
                <Text className="absolute left-4 top-3 text-light-textSecondary dark:text-dark-textSecondary">
                  Rs
                </Text>
                <TextInput
                  value={currentItem.price?.toString() || ''}
                  onChangeText={text => {
                    const numericValue = text === '' ? 0 : parseFloat(text);
                    if (!isNaN(numericValue)) {
                      dispatch(updateCurrentItem({price: numericValue}));
                    }
                  }}
                  className="h-11 pl-8 pr-4 rounded-lg bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text border border-light-border dark:border-dark-border"
                  placeholder="0.00"
                  placeholderTextColor={
                    theme === 'dark' ? '#9CA3AF' : '#4B5563'
                  }
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Additional Details Section */}
            <TouchableOpacity
              onPress={() => setIsVisible(!isVisible)}
              className="mt-4 rounded-lg p-4 border border-light-border dark:border-dark-border">
              <View className="flex-row justify-between items-center">
                <Text className="text-[14px] font-medium text-light-text dark:text-dark-text">
                  Additional Details
                </Text>

                <Icon
                  name={isVisible ? 'chevron-up' : 'chevron-down'}
                  size={14}
                  color={theme === 'dark' ? '#9CA3AF' : '#4B5563'}
                />
              </View>

              {isVisible && (
                <View className="mt-4 space-y-4">
                  {/* Stock Quantity */}
                  <View>
                    <Text className="text-[14px] font-medium text-light-text dark:text-dark-text mb-1">
                      Stock Quantity
                    </Text>
                    <TextInput
                      className="h-11 px-4 rounded-lg bg-light-background dark:bg-dark-input text-light-text dark:text-dark-text border border-light-border dark:border-dark-border"
                      placeholder="Enter Stock Quantity"
                      placeholderTextColor="#6B7280"
                      keyboardType="numeric"
                    />
                  </View>

                  {/* Unit */}
                  <View className="mt-2">
                    <Text className="text-[14px] font-medium text-light-text dark:text-dark-text mb-1">
                      Unit
                    </Text>
                    <TextInput
                      className="h-11 px-4 rounded-lg bg-light-background dark:bg-dark-input text-light-text dark:text-dark-text border border-light-border dark:border-dark-border"
                      placeholder="Enter unit"
                      placeholderTextColor="#6B7280"
                      keyboardType="numeric"
                    />
                  </View>

                  {/* Discount */}
                  <View className="mt-2">
                    <Text className="text-[14px] font-medium text-light-text dark:text-dark-text mb-1">
                      Discount
                    </Text>
                    <TextInput
                      className="h-11 px-4 rounded-lg bg-light-background dark:bg-dark-input text-light-text dark:text-dark-text border border-light-border dark:border-dark-border"
                      placeholder="Enter discount"
                      placeholderTextColor="#6B7280"
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Footer */}
        <View className="w-full p-4 bg-light-background dark:bg-dark-background border-t border-light-border dark:border-dark-border">
          <TouchableOpacity
            onPress={handleAddItem}
            className="h-11 rounded-lg bg-emerald-600 items-center justify-center mb-3">
            <Text className="text-white font-medium">Add Item</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('VendorHomeScreen')}>
            <Text className="text-light-textSecondary dark:text-dark-textSecondary text-center">
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddItemsScreen;
