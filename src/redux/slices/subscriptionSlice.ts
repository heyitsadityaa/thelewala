import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface Vendor {
  id: string;
  name: string;
  distance: string;
  description: string;
  imageUrl: string;
  subscribed: string;
}

interface SubscriptionState {
  subscribedVendors: Vendor[];
  subscriptionCount: number;
}

const initialState: SubscriptionState = {
  subscribedVendors: [],
  subscriptionCount: 0,
};

const subscriptionSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    subscribeToVendor: (state, action: PayloadAction<Vendor>) => {
      const vendorExists = state.subscribedVendors.find(
        vendor => vendor.id === action.payload.id,
      );
      if (!vendorExists) {
        state.subscribedVendors.push({
          ...action.payload,
          subscribed: new Date().toLocaleDateString(),
        });
        state.subscriptionCount = state.subscribedVendors.length;
      }
    },
    unsubscribeFromVendor: (state, action: PayloadAction<string>) => {
      state.subscribedVendors = state.subscribedVendors.filter(
        vendor => vendor.id !== action.payload,
      );
      state.subscriptionCount = state.subscribedVendors.length;
    },
    clearAllSubscriptions: state => {
      state.subscribedVendors = [];
      state.subscriptionCount = 0;
    },
  },
});

export const {subscribeToVendor, unsubscribeFromVendor, clearAllSubscriptions} =
  subscriptionSlice.actions;
export default subscriptionSlice.reducer;
