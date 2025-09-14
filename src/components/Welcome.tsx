import {View, Text, TouchableOpacity, Image} from 'react-native';

const logo = require('../assets/images/logo.png');
const customerImage = require('../assets/images/customercoming.png');
const vendorImage = require('../assets/images/signupimg.png');

interface WelcomeProps {
  userType: 'vendor' | 'customer' | null | undefined;
}

const Welcome: React.FC<WelcomeProps> = ({userType}) => {
  return (
    <>
      <Image source={logo} className="w-1/2 mb-4" resizeMode="contain" />
      <Image
        source={userType === 'customer' ? customerImage : vendorImage}
        className="w-full h-40 mb-6"
        resizeMode="cover"
      />

      {/* Title */}
      <Text className="text-3xl font-extrabold text-center text-gray-800 mb-2">
        Welcome Back!
      </Text>
      <Text className="text-base text-center text-gray-500 mb-6">
        Sign in to access your account and explore our offerings.
      </Text>
    </>
  );
};

export default Welcome;
