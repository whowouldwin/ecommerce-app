import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FilterState {
  brand: string[];
  color: string[];
  size: string[];
  priceRange: [number, number] | null;
  categories: string[];
  materials: string[];
}

export const defaultFilters: FilterState = {
  brand: [],
  color: [],
  size: [],
  priceRange: null,
  categories: [],
  materials: [],
};

const filterSlice = createSlice({
  name: 'filters',
  initialState: defaultFilters,
  reducers: {
    setFilterField: <K extends keyof FilterState>(
      state: FilterState,
      action: PayloadAction<{ key: K; value: FilterState[K] }>,
    ) => {
      state[action.payload.key] = action.payload.value;
    },
    setFilters: (state, action: PayloadAction<FilterState>) => {
      return { ...state, ...action.payload };
    },
    resetFilters: () => defaultFilters,
  },
});

export const { setFilterField, setFilters, resetFilters } = filterSlice.actions;
export const filterReducer = filterSlice.reducer;
