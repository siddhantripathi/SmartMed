export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Camera: undefined;
  OCRResult: {
    extractedText?: string;
    medications?: any[];
  };
  Reports: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Medications: undefined;
  Supplements: undefined;
  Interactions: undefined;
  Profile: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};
