import bcrypt from 'bcryptjs';
import { query } from '../../db/index.js';
import { IAuthUserData, IRegisterPayload } from './auth.interface.js';

export interface IUserEntity extends IAuthUserData {
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

// Default development hash for password: 'password123'
const devPasswordHash = bcrypt.hashSync('password123', 10);

// In-memory fallback cache seeded with authentic Bangladesh development accounts
const memoryUsers: IUserEntity[] = [
  {
    id: 'usr_buet_01',
    role: 'tutor',
    fullName: 'Tanvir Ahmed',
    phone: '01712345678',
    email: 'tanvir@example.com',
    passwordHash: devPasswordHash,
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'usr_grd_001',
    role: 'guardian',
    fullName: 'Dr. Shahana Parveen',
    phone: '01811223344',
    email: 'guardian@example.com',
    passwordHash: devPasswordHash,
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const AuthModel = {
  async findByIdentifier(identifier: string): Promise<IUserEntity | null> {
    try {
      const result = await query<IUserEntity>(
        `SELECT id, role, full_name as "fullName", phone, email, password_hash as "passwordHash",
                is_verified as "isVerified", created_at as "createdAt", updated_at as "updatedAt"
         FROM users
         WHERE phone = $1 OR email = $1
         LIMIT 1`,
        [identifier]
      );
      if (result.rows.length > 0) {
        return result.rows[0];
      }
    } catch {
      // Fallback to memory
    }

    const found = memoryUsers.find(
      (u) => u.phone === identifier || (u.email && u.email.toLowerCase() === identifier.toLowerCase())
    );
    return found || null;
  },

  async findById(id: string): Promise<IUserEntity | null> {
    try {
      const result = await query<IUserEntity>(
        `SELECT id, role, full_name as "fullName", phone, email, password_hash as "passwordHash",
                is_verified as "isVerified", created_at as "createdAt", updated_at as "updatedAt"
         FROM users
         WHERE id = $1
         LIMIT 1`,
        [id]
      );
      if (result.rows.length > 0) {
        return result.rows[0];
      }
    } catch {
      // Fallback to memory
    }

    const found = memoryUsers.find((u) => u.id === id);
    return found || null;
  },

  async createUser(payload: IRegisterPayload, passwordHash: string): Promise<IUserEntity> {
    const id = `usr_${Math.random().toString(36).substring(2, 10)}`;
    const now = new Date().toISOString();

    const newUser: IUserEntity = {
      id,
      role: payload.role,
      fullName: payload.fullName,
      phone: payload.phone,
      email: payload.email,
      passwordHash,
      isVerified: false,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await query(
        `INSERT INTO users (id, role, full_name, phone, email, password_hash, is_verified, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          newUser.id,
          newUser.role,
          newUser.fullName,
          newUser.phone,
          newUser.email,
          newUser.passwordHash,
          newUser.isVerified,
          newUser.createdAt,
          newUser.updatedAt,
        ]
      );
    } catch {
      // Fallback to memory
      memoryUsers.push(newUser);
      return newUser;
    }

    memoryUsers.push(newUser);
    return newUser;
  },
};
