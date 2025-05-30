import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FilterState {
  brand: string[];
  color: string[];
  size: string[];
  priceRange: [number, number] | null;
  categories: string[];
  materials: string[];
}
const initialState: FilterState = {
  brand: [],
  color: [],
  size: [],
  priceRange: null,
  categories: [],
  materials: [],
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setBrand: (state, action: PayloadAction<string[]>) => {
      state.brand = action.payload;
    },
    setColor: (state, action: PayloadAction<string[]>) => {
      state.color = action.payload;
    },
    setSize: (state, action: PayloadAction<string[]>) => {
      state.size = action.payload;
    },
    setPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.priceRange = action.payload;
    },
    setFilters: (state, action: PayloadAction<FilterState>) => {
      return { ...state, ...action.payload };
    },
    resetFilters: () => initialState,
  },
});

export const {
  setBrand,
  setColor,
  setSize,
  setPriceRange,
  resetFilters,
  setFilters,
} = filterSlice.actions;
export const filterReducer = filterSlice.reducer;
