import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TripSummary {
  id: string;
  fromCity: string;
  toCity: string;
  date: string; // YYYY-MM-DD
  departureTime: string; // HH:mm
  arrivalTime: string; // HH:mm
  price: number;
  seats: Array<{ id: number; occupied: boolean; gender?: "male" | "female" }>;
}

interface TripsState {
  trips: TripSummary[];
}

const initialState: TripsState = {
  trips: [],
};

const tripsSlice = createSlice({
  name: "trips",
  initialState,
  reducers: {
    setTrips(state, action: PayloadAction<TripSummary[]>) {
      state.trips = action.payload;
    },
    occupySeats(state, action: PayloadAction<{ tripId: string; seatIds: number[]; gender: "male" | "female" }>) {
      const { tripId, seatIds, gender } = action.payload;

      
      const trip = state.trips.find(t => t.id === tripId);
      
      if (trip) {
        seatIds.forEach(seatId => {
          const seat = trip.seats.find(s => s.id === seatId);
          if (seat) {
            seat.occupied = true;
            seat.gender = gender;

          }
        });
      } else {
        console.warn('❌ Sefer bulunamadı:', tripId);
      }
    },
  },
});

export const { setTrips, occupySeats } = tripsSlice.actions;
export default tripsSlice.reducer;


