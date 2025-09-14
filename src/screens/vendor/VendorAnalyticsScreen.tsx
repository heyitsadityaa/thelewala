import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
// import {LineChart, PieChart} from 'react-native-chart-kit';
import {Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon1 from 'react-native-vector-icons/Ionicons';
import {Picker} from '@react-native-picker/picker';
import {useColorScheme} from 'react-native';

const vendorItemImg1 = require('../../assets/images/vendorItemImg1.png');
const vendorItemImg2 = require('../../assets/images/vendorItemImg2.png');

const VendorAnalyticsScreen = () => {
  const [timeframe, setTimeframe] = useState('This Week');
  const theme = useColorScheme();

  return (
    <SafeAreaView className="bg-light-background dark:bg-dark-background flex-1">
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme === 'dark' ? '#1F2937' : '#ffffff'}
      />

      <View className="w-full backdrop-blur-sm bg-light-background dark:bg-dark-background border-b border-light-border dark:border-dark-border">
        <View className="flex-row justify-center items-center px-4 py-4">
          <Text className="text-lg text-light-text dark:text-dark-text font-semibold">
            Analytics
          </Text>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 pb-16">
        <View className="p-4 space-y-6">
          {/* Metrics Grid */}
          <View className="flex-row justify-between">
            <View className="bg-light-card dark:bg-dark-card rounded-xl p-3 flex-1 mr-2 border border-light-border dark:border-dark-border">
              <Text className="text-xs text-light-textSecondary dark:text-dark-textSecondary">
                Total Revenue
              </Text>
              <Text className="text-lg font-semibold text-light-text dark:text-dark-text">
                $12,458
              </Text>
              <View className="flex-row items-center">
                <Icon name="arrow-up" size={10} color="#16BC88" />
                <Text className="text-xs text-green-500 ml-1">12%</Text>
              </View>
            </View>
            <View className="bg-light-card dark:bg-dark-card rounded-xl p-3 flex-1 mr-2 border border-light-border dark:border-dark-border">
              <Text className="text-xs text-light-textSecondary dark:text-dark-textSecondary">
                Orders
              </Text>
              <Text className="text-lg font-semibold text-light-text dark:text-dark-text">
                847
              </Text>
              <View className="flex-row items-center">
                <Icon name="arrow-up" size={10} color="#16BC88" />
                <Text className="text-xs text-green-500 ml-1">8%</Text>
              </View>
            </View>
            <View className="bg-light-card dark:bg-dark-card rounded-xl p-3 flex-1 border border-light-border dark:border-dark-border">
              <Text className="text-xs text-light-textSecondary dark:text-dark-textSecondary">
                Avg. Order
              </Text>
              <Text className="text-lg font-semibold text-light-text dark:text-dark-text">
                $14.7
              </Text>
              <View className="flex-row items-center">
                <Icon name="arrow-up" size={10} color="#16BC88" />
                <Text className="text-xs text-green-500 ml-1">3%</Text>
              </View>
            </View>
          </View>

          {/* Revenue Trend */}
          <View className="bg-light-card dark:bg-dark-card rounded-xl p-4 border border-light-border dark:border-dark-border mt-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="font-semibold text-light-text dark:text-dark-text">
                Revenue Trend
              </Text>
              <View className="bg-light-input dark:bg-dark-input rounded-lg">
                <Picker
                  selectedValue={timeframe}
                  onValueChange={(value: any) => setTimeframe(value)}
                  className="text-light-text dark:text-dark-text text-sm h-8 w-32"
                  dropdownIconColor={theme === 'dark' ? '#FFFFFF' : '#374151'}>
                  <Picker.Item label="This Week" value="This Week" />
                  <Picker.Item label="This Month" value="This Month" />
                  <Picker.Item label="This Year" value="This Year" />
                </Picker>
              </View>
            </View>
            {/* <LineChart
              data={{
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                  {
                    data: [820, 932, 901, 934, 1290, 1330, 1320],
                  },
                ],
              }}
              width={screenWidth - 48}
              height={180}
              chartConfig={{
                backgroundColor: '#1F2937',
                backgroundGradientFrom: '#1F2937',
                backgroundGradientTo: '#1F2937',
                decimalPlaces: 0,
                color: () => '#16BC88',
                labelColor: () => '#9CA3AF',
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '5',
                  strokeWidth: '1',
                  stroke: '#16BC88',
                },
                fillShadowGradientFrom: '#16BC88',
                fillShadowGradientOpacity: 0.3,
                fillShadowGradientTo: 'rgba(22, 188, 136, 0)',
              }}
              bezier
              style={{borderRadius: 16}}
            /> */}
          </View>

          {/* Top Products */}
          <View>
            <View className="flex-row items-center justify-between mb-4 mt-4">
              <Text className="font-semibold text-light-text dark:text-dark-text">
                Top Products
              </Text>
              <TouchableOpacity>
                <Text className="text-sm text-green-500">View All</Text>
              </TouchableOpacity>
            </View>
            <View className="gap-3">
              <View className="bg-light-card dark:bg-dark-card rounded-xl p-3 flex-row border border-light-border dark:border-dark-border">
                <Image
                  source={vendorItemImg1}
                  className="w-20 h-20 rounded-lg"
                />
                <View className="ml-3 flex-1">
                  <Text className="font-medium text-light-text dark:text-dark-text">
                    Classic Croissant
                  </Text>
                  <Text className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                    342 orders
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <View className="flex-1 bg-gray-300 dark:bg-gray-700 h-1.5 rounded-full">
                      <View
                        className="bg-green-500 h-full rounded-full"
                        style={{width: '75%'}}
                      />
                    </View>
                    <Text className="ml-2 text-sm text-green-500">75%</Text>
                  </View>
                </View>
              </View>
              <View className="bg-light-card dark:bg-dark-card rounded-xl p-3 flex-row border border-light-border dark:border-dark-border">
                <Image
                  source={vendorItemImg2}
                  className="w-20 h-20 rounded-lg"
                />
                <View className="ml-3 flex-1">
                  <Text className="font-medium text-light-text dark:text-dark-text">
                    Chocolate Dream Cake
                  </Text>
                  <Text className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                    287 orders
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <View className="flex-1 bg-gray-300 dark:bg-gray-700 h-1.5 rounded-full">
                      <View
                        className="bg-green-500 h-full rounded-full"
                        style={{width: '66%'}}
                      />
                    </View>
                    <Text className="ml-2 text-sm text-green-500">66%</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VendorAnalyticsScreen;
