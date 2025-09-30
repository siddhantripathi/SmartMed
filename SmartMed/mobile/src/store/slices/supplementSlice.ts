import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Supplement {
  id?: string;
  name: string;
  dosage: string;
  frequency: string;
  category: 'vitamin' | 'mineral' | 'herb' | 'protein' | 'other';
  brand?: string;
  isActive: boolean;
  startDate: string;
  createdAt: string;
  updatedAt?: string;
}

interface SupplementState {
  supplements: Supplement[];
  loading: boolean;
  error: string | null;
}

const initialState: SupplementState = {
  supplements: [],
  loading: false,
  error: null,
};

const supplementSlice = createSlice({
  name: 'supplements',
  initialState,
  reducers: {
    setSupplements: (state, action: PayloadAction<Supplement[]>) => {
      state.supplements = action.payload;
      state.loading = false;
      state.error = null;
    },
    addSupplement: (state, action: PayloadAction<Supplement>) => {
      state.supplements.push(action.payload);
    },
    updateSupplement: (state, action: PayloadAction<{ id: string; updates: Partial<Supplement> }>) => {
      const index = state.supplements.findIndex(supp => supp.id === action.payload.id);
      if (index !== -1) {
        state.supplements[index] = { ...state.supplements[index], ...action.payload.updates };
      }
    },
    deleteSupplement: (state, action: PayloadAction<string>) => {
      state.supplements = state.supplements.filter(supp => supp.id !== action.payload);
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

export const { setSupplements, addSupplement, updateSupplement, deleteSupplement, setLoading, setError } = supplementSlice.actions;
export default supplementSlice.reducer;
