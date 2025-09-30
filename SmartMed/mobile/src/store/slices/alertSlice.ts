import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Alert {
  id?: string;
  interactionId: string;
  alertType: 'interaction' | 'reminder' | 'expiry';
  message: string;
  severityLevel: 'low' | 'medium' | 'high' | 'critical';
  isRead: boolean;
  isAcknowledged: boolean;
  createdAt: string;
  readAt?: string;
  acknowledgedAt?: string;
}

interface AlertState {
  alerts: Alert[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: AlertState = {
  alerts: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

const alertSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    setAlerts: (state, action: PayloadAction<Alert[]>) => {
      state.alerts = action.payload;
      state.unreadCount = action.payload.filter(alert => !alert.isRead).length;
      state.loading = false;
      state.error = null;
    },
    addAlert: (state, action: PayloadAction<Alert>) => {
      state.alerts.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const alert = state.alerts.find(a => a.id === action.payload);
      if (alert && !alert.isRead) {
        alert.isRead = true;
        alert.readAt = new Date().toISOString();
        state.unreadCount -= 1;
      }
    },
    markAsAcknowledged: (state, action: PayloadAction<string>) => {
      const alert = state.alerts.find(a => a.id === action.payload);
      if (alert) {
        alert.isAcknowledged = true;
        alert.acknowledgedAt = new Date().toISOString();
      }
    },
    deleteAlert: (state, action: PayloadAction<string>) => {
      const alertIndex = state.alerts.findIndex(a => a.id === action.payload);
      if (alertIndex !== -1) {
        const alert = state.alerts[alertIndex];
        if (!alert.isRead) {
          state.unreadCount -= 1;
        }
        state.alerts.splice(alertIndex, 1);
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

export const { setAlerts, addAlert, markAsRead, markAsAcknowledged, deleteAlert, setLoading, setError } = alertSlice.actions;
export default alertSlice.reducer;
