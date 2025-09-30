import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Medication {
  id?: string;
  name: string;
  dosage: string;
  frequency: string;
  ndcCode?: string;
  rxnormId?: string;
  isActive: boolean;
  prescribedBy?: string;
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt?: string;
}

interface MedicationState {
  medications: Medication[];
  loading: boolean;
  error: string | null;
}

const initialState: MedicationState = {
  medications: [],
  loading: false,
  error: null,
};

const medicationSlice = createSlice({
  name: 'medications',
  initialState,
  reducers: {
    setMedications: (state, action: PayloadAction<Medication[]>) => {
      state.medications = action.payload;
      state.loading = false;
      state.error = null;
    },
    addMedication: (state, action: PayloadAction<Medication>) => {
      state.medications.push(action.payload);
    },
    updateMedication: (state, action: PayloadAction<{ id: string; updates: Partial<Medication> }>) => {
      const index = state.medications.findIndex(med => med.id === action.payload.id);
      if (index !== -1) {
        state.medications[index] = { ...state.medications[index], ...action.payload.updates };
      }
    },
    deleteMedication: (state, action: PayloadAction<string>) => {
      state.medications = state.medications.filter(med => med.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setMedications, addMedication, updateMedication, deleteMedication, setLoading, setError } = medicationSlice.actions;
export default medicationSlice.reducer;
