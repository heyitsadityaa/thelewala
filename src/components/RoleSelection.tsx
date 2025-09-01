import {View, Text, TouchableOpacity} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

interface RoleSelectionProps {
  setUserType: React.Dispatch<
    React.SetStateAction<'vendor' | 'customer' | null | undefined>
  >;
  userType: 'vendor' | 'customer' | null | undefined;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({
  setUserType,
  userType,
}) => {
  return (
    <View className="w-full mb-6">
      <Text className="text-center text-lg mb-3 italic">
        I want to join as:{' '}
      </Text>
      <View className="flex-row mb-6 w-full border-gray-300 border rounded-lg">
        {/* Customer Button */}
        <TouchableOpacity
          className={`flex-1 py-3 items-center rounded-l-lg flex-row justify-center ${
            userType === 'customer' ? 'bg-black text-white' : 'text-black'
          }`}
          onPress={() => setUserType('customer')}>
          {userType === 'customer' && (
            <Icon name="check" size={20} color="green" className="mr-2" />
          )}
          <Text
            className={`text-lg ${
              userType === 'customer' ? 'text-white' : 'text-black'
            }`}>
            Customer
          </Text>
        </TouchableOpacity>

        {/* Vendor Button */}
        <TouchableOpacity
          className={`flex-1 py-3 items-center rounded-r-lg flex-row justify-center ${
            userType === 'vendor' ? 'bg-black text-white' : 'text-black'
          }`}
          onPress={() => setUserType('vendor')}>
          {userType === 'vendor' && (
            <Icon name="check" size={20} color="green" className="mr-2" />
          )}
          <Text
            className={`text-lg ${
              userType === 'vendor' ? 'text-white' : 'text-black'
            }`}>
            Vendor
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RoleSelection;
