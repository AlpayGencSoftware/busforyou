import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BookingState {
  selectedTripId: string | null;
  selectedSeatIds: number[];
  totalPrice: number;
  lastPurchasedSeats: { [tripId: string]: number[] }; // Son satın alınan koltuklar
}

const initialState: BookingState = {
  selectedTripId: null,
  selectedSeatIds: [],
  totalPrice: 0,
  lastPurchasedSeats: {},
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    startBooking(state, action: PayloadAction<{ tripId: string; basePrice: number; userTickets?: { tripId: string; seatNumbers: number[] }[] }>) {
      const { tripId, userTickets } = action.payload;
      
      // Set trip ID
      state.selectedTripId = tripId;
      
      // Bu sefer için daha önce satın alınan koltuklar varsa onları kaydet
      let lastPurchased = state.lastPurchasedSeats?.[tripId] || [];
      
      // Eğer lastPurchasedSeats boş/undefined ise, tickets'tan kontrol et
      if (lastPurchased.length === 0 && userTickets) {
        const ticketForThisTrip = userTickets.find(ticket => ticket.tripId === tripId);
        if (ticketForThisTrip) {
          lastPurchased = ticketForThisTrip.seatNumbers || [];
          // lastPurchasedSeats'i başlat (undefined ise)
          if (!state.lastPurchasedSeats) {
            state.lastPurchasedSeats = {};
          }
          // Otomatik olarak kaydet
          state.lastPurchasedSeats[tripId] = [...lastPurchased];
        }
      }
      
      // Yeni sefer için koltuk seçimini temizle
      if (state.selectedSeatIds.length > 0) {
        state.selectedSeatIds = [];
        state.totalPrice = 0;
      }
    },
    toggleSeat(state, action: PayloadAction<{ seatId: number; price: number }>) {
      const exists = state.selectedSeatIds.includes(action.payload.seatId);
      if (exists) {
        state.selectedSeatIds = state.selectedSeatIds.filter((s) => s !== action.payload.seatId);
        state.totalPrice -= action.payload.price;
      } else {
        if (state.selectedSeatIds.length >= 5) {
          return;
        }
        state.selectedSeatIds.push(action.payload.seatId);
        state.totalPrice += action.payload.price;
      }
    },
    savePurchasedSeats(state, action: PayloadAction<{ tripId: string; seatIds: number[] }>) {
      const { tripId, seatIds } = action.payload;
      state.lastPurchasedSeats[tripId] = [...seatIds];
    },
    clearBooking(state) {
      state.selectedTripId = null;
      state.selectedSeatIds = [];
      state.totalPrice = 0;
    },
  },
});

export const { startBooking, toggleSeat, savePurchasedSeats, clearBooking } = bookingSlice.actions;
export default bookingSlice.reducer;


