import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface Item {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  unit: string;
  discount: number;
}

interface ItemState {
  currentItem: Partial<Item>;
  items: Item[];
}

const initialState: ItemState = {
  currentItem: {
    name: '',
    price: 0,
    category: '',
    stock: 0,
    unit: '',
    discount: 0,
  },
  items: [],
};

const itemSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    updateCurrentItem: (state, action: PayloadAction<Partial<Item>>) => {
      state.currentItem = {...state.currentItem, ...action.payload};
    },
    addItem: state => {
      const newItem = {...state.currentItem, id: Date.now().toString()} as Item;
      state.items.push(newItem);
      state.currentItem = initialState.currentItem;
    },
    resetCurrentItem: state => {
      state.currentItem = initialState.currentItem;
    },
  },
});

export const {updateCurrentItem, addItem, resetCurrentItem} = itemSlice.actions;
export default itemSlice.reducer;
