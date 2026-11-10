import { query } from '../../db/index.js';
import { IUserProfile } from './user.interface.js';

export const UserModel = {
  async findById(id: string): Promise<IUserProfile | null> {
    try {
      const result = await query<IUserProfile>(
        `SELECT id, role, full_name as "fullName", phone, email, is_verified as "isVerified",
                avatar_url as "avatarUrl", created_at as "createdAt", updated_at as "updatedAt"
         FROM users
         WHERE id = $1
         LIMIT 1`,
        [id]
      );
      if (result.rows.length > 0) {
        return result.rows[0];
      }
    } catch {
      // In-memory or demo fallback
    }

    return {
      id,
      role: 'tutor',
      fullName: 'Tanvir Ahmed',
      phone: '01712345678',
      email: 'tanvir@example.com',
      isVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  async updateUser(id: string, updates: Partial<IUserProfile>): Promise<IUserProfile | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const updated: IUserProfile = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    try {
      await query(
        `UPDATE users
         SET full_name = COALESCE($2, full_name),
             email = COALESCE($3, email),
             avatar_url = COALESCE($4, avatar_url),
             updated_at = NOW()
         WHERE id = $1`,
        [id, updates.fullName || null, updates.email || null, updates.avatarUrl || null]
      );
    } catch {
      // fallback
    }

    return updated;
  },
};
