import React, {useEffect, useState} from 'react';
import {GlobalProvider} from './src/context/GlobalProvider';
import {VendorAuthProvider} from './src/context/VendorAuthContext';
import {CustomerAuthProvider} from './src/context/CustomerAuthContext';

import './global.css';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {View, Text, useColorScheme} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import VendorHomeScreen from './src/screens/vendor/VendorHomeScreen.tsx';
import VendorSignInScreen from './src/screens/vendor/VendorSignInScreen';
import VendorSignUpScreen from './src/screens/vendor/VendorSignUpScreen';
import AppLoadScreen from './src/screens/AppLoadScreen';
import CustomerSignInScreen from './src/screens/customer/CustomerSignInScreen';
import CustomerSignUpScreen from './src/screens/customer/CustomerSignUpScreen';
import UserSelectionScreen from './src/screens/UserSelectionScreen';
import RNSecureStorage, {ACCESSIBLE} from 'rn-secure-storage';
import CustomerHomeScreen from './src/screens/customer/CustomerHomeScreen.tsx';
import CustomerProfileScreen from './src/screens/customer/CustomerProfileScreen';
import CustomerFavouritesScreen from './src/screens/customer/CustomerFavouritesScreen';
import CustomerSubscribedScreen from './src/screens/customer/CustomerSubscribedScreen';
import CustomerOrderHistoryScreen from './src/screens/customer/CustomerOrderHistoryScreen';
import CustomerSettingScreen from './src/screens/customer/CustomerSettingScreen';
import AddItemsScreen from './src/screens/vendor/AddItemsScreen';
import VendorItemsScreen from './src/screens/vendor/VendorItemsScreen';
import VendorAnalyticsScreen from './src/screens/vendor/VendorAnalyticsScreen';
import VendorProfileScreen from './src/screens/vendor/VendorProfileScreen';

import {Provider} from 'react-redux';
import {store, persistor} from './src/redux/store';
import {PersistGate} from 'redux-persist/integration/react';

import {
  ChartBarIcon,
  ClipboardDocumentListIcon,
  HeartIcon,
  HomeIcon,
  UserIcon,
} from 'react-native-heroicons/outline';
import VendorDetailScreen from './src/screens/customer/VendorDetailScreen.tsx';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const MTab = createMaterialTopTabNavigator();

function App(): React.JSX.Element {
  const [userType, setUserType] = useState<
    'vendor' | 'customer' | null | undefined
  >(undefined);

  useEffect(() => {
    const checkUserType = async () => {
      if (await RNSecureStorage.exist('userType')) {
        const userType = await RNSecureStorage.getItem('userType');
        console.log({userType});

        setUserType(userType as 'vendor' | 'customer' | null | undefined);
      } else {
        setUserType(null);
      }
    };

    checkUserType();
  }, []);

  useEffect(() => {
    console.log({userType});

    if (userType !== undefined && userType !== null) {
      RNSecureStorage.setItem('userType', userType, {
        accessible: ACCESSIBLE.WHEN_UNLOCKED,
      });
      console.log('User type set');
    }
  }, [userType]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <NavigationContainer>
        <GlobalProvider>
          {userType === undefined && <AppLoadScreen />}
          {userType === null && (
            <UserSelectionScreen
              userType={userType}
              setUserType={setUserType}
            />
          )}
          {userType === 'vendor' && (
            <VendorAuthProvider setUserType={setUserType}>
              <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                  <Stack.Navigator screenOptions={{headerShown: false}}>
                    <Stack.Screen name="VendorSignInScreen">
                      {props => (
                        <VendorSignInScreen
                          {...props}
                          setUserType={setUserType}
                          userType={userType}
                        />
                      )}
                    </Stack.Screen>
                    <Stack.Screen name="VendorSignUpScreen">
                      {props => (
                        <VendorSignUpScreen
                          {...props}
                          setUserType={setUserType}
                          userType={userType}
                        />
                      )}
                    </Stack.Screen>
                    <Stack.Screen
                      name="VendorHomeScreen"
                      component={VendorTab}
                    />
                    <Stack.Screen
                      name="AddItemsScreen"
                      component={AddItemsScreen}
                    />
                  </Stack.Navigator>
                </PersistGate>
              </Provider>
            </VendorAuthProvider>
          )}
          {userType === 'customer' && (
            <CustomerAuthProvider setUserType={setUserType}>
              <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                  <Stack.Navigator screenOptions={{headerShown: false}}>
                    <Stack.Screen name="CustomerSignInScreen">
                      {props => (
                        <CustomerSignInScreen
                          {...props}
                          setUserType={setUserType}
                          userType={userType}
                        />
                      )}
                    </Stack.Screen>
                    <Stack.Screen name="CustomerSignUpScreen">
                      {props => (
                        <CustomerSignUpScreen
                          {...props}
                          setUserType={setUserType}
                          userType={userType}
                        />
                      )}
                    </Stack.Screen>
                    <Stack.Screen
                      name="CustomerHomeScreen"
                      component={CustomerTab}
                    />
                    <Stack.Screen
                      name="CustomerSettingScreen"
                      component={CustomerSettingScreen}
                    />
                    <Stack.Screen
                      name="VendorDetailScreen"
                      component={VendorDetailScreen}
                    />
                  </Stack.Navigator>
                </PersistGate>
              </Provider>
            </CustomerAuthProvider>
          )}
        </GlobalProvider>
      </NavigationContainer>
    </SafeAreaView>
  );
}

export default App;

function CustomerTab(): React.JSX.Element {
  const theme = useColorScheme();
  const isDarkMode = theme === 'dark';

  return (
    <Tab.Navigator
      backBehavior="firstRoute"
      screenOptions={{
        animation: 'shift',

        tabBarLabelPosition: 'below-icon',
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 10,
          textAlign: 'center',
          color: '#9ca3af',
        },
        tabBarIconStyle: {
          fontSize: 18,
          textAlign: 'center',
        },
        tabBarStyle: {
          height: 61,
          backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
          borderTopColor: isDarkMode ? '#374151' : '#E5E7EB',
        },

        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: isDarkMode ? '#9CA3AF' : '#6B7280',
        tabBarHideOnKeyboard: true,
      }}>
      <Tab.Screen
        name="Home"
        component={CustomerHomeScreen}
        options={{
          tabBarIcon: HomeIcon,
        }}
      />
      <Tab.Screen
        name="My Favourites"
        options={{
          tabBarIcon: HeartIcon,
        }}
        component={CustomerSubscribedScreen}
      />
      {/* <Tab.Screen
        name="Orders"
        options={{
          tabBarIcon: ClipboardDocumentListIcon,
        }}
        component={CustomerOrderHistoryScreen}
      /> */}
      <Tab.Screen
        name="Profile"
        options={{
          tabBarIcon: UserIcon,
        }}
        component={CustomerProfileScreen}
      />
    </Tab.Navigator>
  );
}

// function CustomerFavouriteTab(): React.JSX.Element {
//   const theme = useColorScheme();
//   const isDarkMode = theme === 'dark';

//   return (
//     <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
//       {/* ✅ Custom Header */}
//       <View
//         className={`h-16 flex items-center justify-center ${
//           isDarkMode
//             ? 'bg-gray-800 border-gray-700'
//             : 'bg-gray-100 border-gray-300'
//         }`}>
//         <Text
//           className={`text-lg font-bold ${
//             isDarkMode ? 'text-white' : 'text-gray-900'
//           }`}>
//           Favourites
//         </Text>
//       </View>
//       <MTab.Navigator
//         screenOptions={{
//           tabBarLabelStyle: {fontSize: 12, fontWeight: 'bold'},
//           tabBarIndicatorStyle: {backgroundColor: '#10B981'},
//           tabBarStyle: {
//             backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
//             borderBottomColor: isDarkMode ? '#374151' : '#E5E7EB',
//           },
//           tabBarActiveTintColor: '#10B981',
//           tabBarInactiveTintColor: isDarkMode ? '#9CA3AF' : '#6B7280',
//         }}>
//         <MTab.Screen name="Favourites" component={CustomerFavouritesScreen} />
//         <MTab.Screen name="Subscribed" component={CustomerSubscribedScreen} />
//       </MTab.Navigator>
//     </View>
//   );
// }

function VendorTab(): React.JSX.Element {
  const theme = useColorScheme();
  const isDarkMode = theme === 'dark';

  return (
    <Tab.Navigator
      backBehavior="firstRoute"
      screenOptions={{
        animation: 'shift',
        tabBarLabelPosition: 'below-icon',
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 10,
          textAlign: 'center',
          color: '#9ca3af',
        },
        tabBarIconStyle: {
          fontSize: 18,
          textAlign: 'center',
        },
        tabBarStyle: {
          height: 61,
          backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
          borderTopColor: isDarkMode ? '#374151' : '#E5E7EB',
        },
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: isDarkMode ? '#9CA3AF' : '#6B7280',
      }}>
      <Tab.Screen
        name="Home"
        component={VendorHomeScreen}
        options={{
          tabBarIcon: HomeIcon,
        }}
      />
      <Tab.Screen
        name="Items"
        options={{
          tabBarIcon: ClipboardDocumentListIcon,
        }}
        component={VendorItemsScreen}
      />
      {/* <Tab.Screen
        name="Analytics"
        options={{
          tabBarIcon: ChartBarIcon,
        }}
        component={VendorAnalyticsScreen}
      /> */}

      <Tab.Screen
        name="Profile"
        options={{
          tabBarIcon: UserIcon,
        }}
        component={VendorProfileScreen}
      />
    </Tab.Navigator>
  );
}
