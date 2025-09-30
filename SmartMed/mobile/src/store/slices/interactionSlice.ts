import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Interaction {
  id?: string;
  medicationId?: string;
  supplementId?: string;
  medicationName?: string;
  supplementName?: string;
  severityLevel: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendation: string;
  source: string;
  lastUpdated: string;
}

interface InteractionState {
  interactions: Interaction[];
  currentCheck: Interaction[];
  loading: boolean;
  error: string | null;
}

const initialState: InteractionState = {
  interactions: [],
  currentCheck: [],
  loading: false,
  error: null,
};

const interactionSlice = createSlice({
  name: 'interactions',
  initialState,
  reducers: {
    setInteractions: (state, action: PayloadAction<Interaction[]>) => {
      state.interactions = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCurrentCheck: (state, action: PayloadAction<Interaction[]>) => {
      state.currentCheck = action.payload;
    },
    addInteraction: (state, action: PayloadAction<Interaction>) => {
      state.interactions.push(action.payload);
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

export const { setInteractions, setCurrentCheck, addInteraction, setLoading, setError } = interactionSlice.actions;
export default interactionSlice.reducer;
