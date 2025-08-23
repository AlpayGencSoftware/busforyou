import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Gender = "male" | "female";

export interface UserProfile {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  birthDate: string; // ISO date string
  phone?: string; // Telefon numarası (opsiyonel)
  tcNumber?: string; // TC Kimlik numarası (opsiyonel)
}

interface AuthState {
  currentUser: UserProfile | null;
  users: UserProfile[]; // mock kayıtlı kullanıcılar
  error: string | null;
}

const initialState: AuthState = {
  currentUser: null,
  users: [
    // Demo kullanıcı - test için
    {
      id: 'demo-user-1',
      email: 'demo@bus4you.com',
      password: 'Demo1!',
      firstName: 'Ahmet',
      lastName: 'Yılmaz',
      gender: 'male' as Gender,
      birthDate: '1990-03-15',
      phone: '+90 532 123 45 67',
      tcNumber: '12345678901'
    }
  ],
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    registerUser(state, action: PayloadAction<UserProfile>) {
      const exists = state.users.some((u) => u.email === action.payload.email);
      if (exists) {
        state.error = "Bu e-posta ile kullanıcı zaten mevcut";
        return;
      }
      state.users.push(action.payload);
      state.error = null;
    },
    login(state, action: PayloadAction<{ email: string; password: string }>) {
      const found = state.users.find(
        (u) => u.email === action.payload.email && u.password === action.payload.password
      );
      if (found) {
        state.currentUser = found;
        state.error = null;
      } else {
        state.error = "E-posta veya şifre hatalı";
      }
    },
    logout(state) {
      state.currentUser = null;
      // Not: Persist temizliği component'te yapılacak (persistor.purge)
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
});

export const { registerUser, login, logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;


