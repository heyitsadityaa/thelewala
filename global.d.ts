import 'react-native';

declare module 'react-native' {
  interface ViewProps {
    className?: string;
  }
  interface TextProps {
    className?: string;
  }
  interface ImageProps {
    className?: string;
  }
  interface TouchableOpacityProps {
    className?: string;
  }
  interface ScrollViewProps {
    className?: string;
  }
  interface SafeAreaViewProps {
    className?: string;
  }
  interface TouchableOpacityProps {
    className?: string;
  }
}

interface RootStackParamList {
  UserSelectionScreen: undefined;
  AppLoadScreen: undefined;

  VendorSignInScreen: undefined;
  VendorSignUpScreen: undefined;

  VendorHomeScreen: undefined;
  AddItemsScreen: undefined;

  CustomerSignInScreen: undefined;
  CustomerSignUpScreen: undefined;

  CustomerHomeScreen: undefined;
  CustomerProfileScreen: undefined;
  CustomerFavouriteScreen: undefined;
  CustomerSubscribedScreen: undefined;
  CustomerOrderHistoryScreen: undefined;
  CustomerSettingScreen: undefined;
  VendorDetailScreen: {
    vendorId: string;
  }; // VendorDetailScreen on customer side
}

interface locationUpdateAckResponse {
  success: boolean;
  message?: string;
  throttle?: number;
  nearbyCustomers?: {
    within10KmRadius: Array<{}>;
    within5KmRadius: Array<{}>;
    within1KmRadius: Array<{}>;
  };
}
