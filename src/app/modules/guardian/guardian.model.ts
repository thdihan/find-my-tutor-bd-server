import { query } from '../../db/index.js';
import { IGuardianProfile } from './guardian.interface.js';

const mockGuardian: IGuardianProfile = {
  id: 'grd_001',
  userId: 'usr_grd_001',
  fullName: 'Dr. Shahana Parveen',
  phone: '01811223344',
  email: 'guardian@example.com',
  district: 'Dhaka',
  area: 'Dhanmondi',
  detailedAddress: 'Road 5, Dhanmondi R/A',
  latitude: 23.7461,
  longitude: 90.3742,
  students: [
    {
      name: 'Aayan Rahman',
      gradeLevel: 'Class 9',
      curriculum: 'english-medium',
      institution: 'Mastermind School',
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockGuardians: IGuardianProfile[] = [mockGuardian];

export const GuardianModel = {
  async findByUserId(userId: string): Promise<IGuardianProfile | null> {
    try {
      const result = await query<IGuardianProfile>(
        `SELECT id, user_id as "userId", full_name as "fullName", phone, email,
                district, area, detailed_address as "detailedAddress",
                ST_Y(location::geometry) as latitude,
                ST_X(location::geometry) as longitude,
                students, created_at as "createdAt", updated_at as "updatedAt"
         FROM guardians
         WHERE user_id = $1
         LIMIT 1`,
        [userId]
      );
      if (result.rows.length > 0) {
        return result.rows[0];
      }
    } catch {
      // fallback
    }

    const found = mockGuardians.find((g) => g.userId === userId);
    return found || null;
  },

  async createProfile(userId: string, data: Partial<IGuardianProfile>): Promise<IGuardianProfile> {
    const newGuardian: IGuardianProfile = {
      id: `grd_${Math.random().toString(36).substring(2, 9)}`,
      userId,
      fullName: data.fullName || 'Guardian',
      phone: data.phone || '',
      email: data.email,
      district: data.district || 'Dhaka',
      area: data.area || 'Dhanmondi',
      detailedAddress: data.detailedAddress || `${data.area || 'Dhanmondi'}, ${data.district || 'Dhaka'}`,
      latitude: data.latitude || 23.7461,
      longitude: data.longitude || 90.3742,
      students: data.students || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockGuardians.push(newGuardian);
    return newGuardian;
  },

  async updateProfile(userId: string, data: Partial<IGuardianProfile>): Promise<IGuardianProfile> {
    const existing = await this.findByUserId(userId);
    const updated: IGuardianProfile = {
      ...(existing || mockGuardian),
      ...data,
      userId,
      updatedAt: new Date().toISOString(),
    };
    return updated;
  },
};
