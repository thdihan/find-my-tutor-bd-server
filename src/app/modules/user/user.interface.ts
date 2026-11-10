import { UserRole } from '../../middlewares/auth.js';

export interface IUserProfile {
  id: string;
  role: UserRole;
  fullName: string;
  phone: string;
  email?: string;
  isVerified: boolean;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUpdateUserPayload {
  fullName?: string;
  email?: string;
  avatarUrl?: string;
}

export interface IChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}
