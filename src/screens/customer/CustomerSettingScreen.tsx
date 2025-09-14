import React, {useState} from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import {
  GlobeAltIcon,
  BellIcon,
  LockClosedIcon,
  KeyIcon,
  UserIcon,
} from 'react-native-heroicons/outline';

const CustomerSettingScreen = () => {
  const theme = useColorScheme();
  const isDarkMode = theme === 'dark';

  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(isDarkMode);

  return (
    <View className="flex-1 p-4 bg-light-background dark:bg-dark-background">
      <Text className="text-lg font-bold mb-4 text-center text-light-text dark:text-dark-text">
        Settings
      </Text>

      {/* Support & About */}
      <View className="p-4 rounded-lg bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border">
        <Text className="text-sm font-semibold text-light-textSecondary dark:text-dark-textSecondary mb-2">
          Support & About
        </Text>
        <Text className="text-light-text dark:text-dark-text">
          App Version 0.0.2
        </Text>
        <Text className="text-light-text dark:text-dark-text">
          Developer: Logo
        </Text>
        <TouchableOpacity className="mt-2">
          <Text className="text-blue-500">Terms of Service</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text className="text-blue-500">Privacy Policy</Text>
        </TouchableOpacity>
      </View>

      {/* Preferences */}
      <View className="mt-4 p-4 rounded-lg bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border">
        <Text className="text-sm font-semibold text-light-textSecondary dark:text-dark-textSecondary mb-2">
          Preferences
        </Text>

        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center">
            <BellIcon size={20} color="#10B981" />
            <Text className="ml-3 text-light-text dark:text-dark-text">
              Push Notifications
            </Text>
          </View>
          <Switch
            value={pushNotifications}
            onValueChange={setPushNotifications}
          />
        </View>

        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center">
            <UserIcon size={20} color="#10B981" />
            <Text className="ml-3 text-light-text dark:text-dark-text">
              Email Notifications
            </Text>
          </View>
          <Switch
            value={emailNotifications}
            onValueChange={setEmailNotifications}
          />
        </View>

        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center">
            <GlobeAltIcon size={20} color="#10B981" />
            <Text className="ml-3 text-light-text dark:text-dark-text">
              Dark Mode
            </Text>
          </View>
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>

        <TouchableOpacity className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <GlobeAltIcon size={20} color="#10B981" />
            <Text className="ml-3 text-light-text dark:text-dark-text">
              Language
            </Text>
          </View>
          <Text className="text-light-textSecondary dark:text-dark-textSecondary">
            English
          </Text>
        </TouchableOpacity>
      </View>

      {/* Privacy & Security */}
      <View className="mt-4 p-4 rounded-lg bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border">
        <Text className="text-sm font-semibold text-light-textSecondary dark:text-dark-textSecondary mb-2">
          Privacy & Security
        </Text>

        <TouchableOpacity className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center">
            <KeyIcon size={20} color="#10B981" />
            <Text className="ml-3 text-light-text dark:text-dark-text">
              Change Password
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center">
            <LockClosedIcon size={20} color="#10B981" />
            <Text className="ml-3 text-light-text dark:text-dark-text">
              App Permissions
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <LockClosedIcon size={20} color="#10B981" />
            <Text className="ml-3 text-light-text dark:text-dark-text">
              Biometric Login
            </Text>
          </View>
          <Switch value={true} />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity className="bg-red-100 py-3 px-8 rounded-full mt-4">
        <Text className="text-red-600 font-medium text-center">Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomerSettingScreen;
