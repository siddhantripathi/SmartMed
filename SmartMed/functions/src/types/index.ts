export interface User {
  uid: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    allergies: string[];
    medicalConditions: string[];
  };
  preferences: {
    notifications: boolean;
    alertFrequency: 'immediate' | 'daily' | 'weekly';
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Medication {
  id?: string;
  name: string;
  dosage: string;
  frequency: string;
  ndcCode?: string;
  rxnormId?: string;
  isActive: boolean;
  prescribedBy?: string;
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Supplement {
  id?: string;
  name: string;
  dosage: string;
  frequency: string;
  category: 'vitamin' | 'mineral' | 'herb' | 'protein' | 'other';
  brand?: string;
  isActive: boolean;
  startDate: Date;
  createdAt: Date;
  updatedAt?: Date;
}

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
  lastUpdated: Date;
}

export interface Alert {
  id?: string;
  userId: string;
  interactionId: string;
  alertType: 'interaction' | 'reminder' | 'expiry';
  message: string;
  severityLevel: 'low' | 'medium' | 'high' | 'critical';
  isRead: boolean;
  isAcknowledged: boolean;
  createdAt: Date;
  readAt?: Date;
  acknowledgedAt?: Date;
}

export interface OCRResult {
  sessionId: string;
  userId: string;
  imageUrl: string;
  extractedText: string;
  processedMedications: Medication[];
  confidence: number;
  status: 'processing' | 'completed' | 'failed';
  createdAt: Date;
  expiresAt: Date;
}

// API response types
export interface MedicalAPIResponse {
  success: boolean;
  data?: any;
  error?: string;
  source: string;
}

export interface InteractionCheckRequest {
  medications: Medication[];
  supplements: Supplement[];
}

export interface InteractionCheckResponse {
  interactions: Interaction[];
  riskLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
}
