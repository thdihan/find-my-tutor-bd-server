import { UserRole } from '../../middlewares/auth.js';

export interface IRegisterPayload {
  role: UserRole;
  fullName: string;
  phone: string;
  email?: string;
  password: string;

  // Guardian specific
  district?: string;
  area?: string;
  curriculum?: 'bangla-medium' | 'english-version' | 'english-medium' | 'madrasah' | 'admission-test';

  // Tutor specific
  occupationType?: 'student' | 'professional';
  university?: string;
  department?: string;
  companyName?: string;
  designation?: string;
  tutoringMode?: 'home' | 'online' | 'both';
}

export interface ILoginPayload {
  identifier: string; // Accepts email or mobile number 01XXXXXXXXX
  password: string;
  role?: UserRole;
}

export interface IGoogleAuthPayload {
  idToken: string;
  role?: UserRole;
}

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthUserData {
  id: string;
  role: UserRole;
  fullName: string;
  phone: string;
  email?: string;
  isVerified: boolean;
}

export interface IAuthResponseData {
  user: IAuthUserData;
  tokens: IAuthTokens;
}
