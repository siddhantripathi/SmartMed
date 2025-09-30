import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserProfile {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  allergies: string[];
  medicalConditions: string[];
}

export interface UserPreferences {
  notifications: boolean;
  alertFrequency: 'immediate' | 'daily' | 'weekly';
}

export interface User {
  uid: string;
  email: string;
  profile: UserProfile;
  preferences: UserPreferences;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: User = {
  uid: '',
  email: '',
  profile: {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    allergies: [],
    medicalConditions: []
  },
  preferences: {
    notifications: true,
    alertFrequency: 'immediate'
  },
  isAuthenticated: false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<User>>) => {
      return { ...state, ...action.payload, isAuthenticated: true, loading: false, error: null };
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    updatePreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      return { ...initialState };
    },
  },
});

export const { setUser, updateProfile, updatePreferences, setLoading, setError, logout } = userSlice.actions;
export default userSlice.reducer;
