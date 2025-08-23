import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import authReducer from "@/store/slices/authSlice";
import searchReducer from "@/store/slices/searchSlice";
import tripsReducer from "@/store/slices/tripsSlice";
import bookingReducer from "@/store/slices/bookingSlice";
import ticketsReducer from "@/store/slices/ticketsSlice";

// Root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  search: searchReducer,
  trips: tripsReducer,
  booking: bookingReducer,
  tickets: ticketsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


