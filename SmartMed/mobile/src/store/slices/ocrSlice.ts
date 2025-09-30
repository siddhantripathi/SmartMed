import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface OCRResult {
  sessionId: string;
  extractedText: string;
  medications: any[];
  confidence: number;
  status: 'processing' | 'completed' | 'failed';
  createdAt: string;
}

interface OCRState {
  currentSession: OCRResult | null;
  history: OCRResult[];
  loading: boolean;
  error: string | null;
}

const initialState: OCRState = {
  currentSession: null,
  history: [],
  loading: false,
  error: null,
};

const ocrSlice = createSlice({
  name: 'ocr',
  initialState,
  reducers: {
    setCurrentSession: (state, action: PayloadAction<OCRResult | null>) => {
      state.currentSession = action.payload;
    },
    updateSessionStatus: (state, action: PayloadAction<{ sessionId: string; status: OCRResult['status'] }>) => {
      if (state.currentSession?.sessionId === action.payload.sessionId) {
        state.currentSession.status = action.payload.status;
      }
    },
    addToHistory: (state, action: PayloadAction<OCRResult>) => {
      state.history.unshift(action.payload);
      // Keep only last 10 sessions
      if (state.history.length > 10) {
        state.history = state.history.slice(0, 10);
      }
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

export const { setCurrentSession, updateSessionStatus, addToHistory, setLoading, setError } = ocrSlice.actions;
export default ocrSlice.reducer;
