import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Ticket {
  id: string;
  userId: string;
  tripId: string;
  fromCity: string;
  toCity: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  seatNumbers: number[];
  totalPrice: number;
  status: 'active' | 'used' | 'cancelled';
  purchaseDate: string;
  busPlate: string;
  companyName: string;
  passengerName: string;
  purchaser: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    tcNumber?: string;
    gender: string;
    birthDate: string;
  };
  payment: {
    method: string;
    cardLastFour: string;
    transactionId: string;
    paymentDate: string;
  };
}

interface TicketsState {
  tickets: Ticket[];
}

const initialState: TicketsState = {
  tickets: [],
};

const ticketsSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {
    addTicket(state, action: PayloadAction<Ticket>) {
      state.tickets.push(action.payload);
    },
    updateTicketStatus(state, action: PayloadAction<{ ticketId: string; status: 'active' | 'used' | 'cancelled' }>) {
      const ticket = state.tickets.find(t => t.id === action.payload.ticketId);
      if (ticket) {
        ticket.status = action.payload.status;
      }
    },
  },
});

export const { addTicket, updateTicketStatus } = ticketsSlice.actions;
export default ticketsSlice.reducer;
