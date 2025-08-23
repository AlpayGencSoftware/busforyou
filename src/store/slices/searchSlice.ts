import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SearchCriteria {
  fromCity: string;
  toCity: string;
  date: string; // YYYY-MM-DD
}

const initialState: SearchCriteria = {
  fromCity: "",
  toCity: "",
  date: "",
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchCriteria(state, action: PayloadAction<SearchCriteria>) {
      state.fromCity = action.payload.fromCity;
      state.toCity = action.payload.toCity;
      state.date = action.payload.date;
    },
    updateSearchField(state, action: PayloadAction<{field: keyof SearchCriteria, value: string}>) {
      const { field, value } = action.payload;
      state[field] = value;
    },
    clearSearchCriteria(state) {
      state.fromCity = "";
      state.toCity = "";
      state.date = "";
    },
  },
});

export const { setSearchCriteria, updateSearchField, clearSearchCriteria } = searchSlice.actions;
export default searchSlice.reducer;


