import { query } from '../../db/index.js';
import { ICreateTuitionPayload, ITuitionApplication, ITuitionFilter, ITuitionJob } from './tuition.interface.js';

const mockTuitions: ITuitionJob[] = [
  {
    id: 'tui_dhn_01',
    guardianId: 'usr_grd_001',
    guardianName: 'Farhana Rahman',
    curriculum: 'english-medium',
    gradeLevel: 'Class 9',
    subjects: ['Physics', 'Mathematics'],
    tuitionType: 'home',
    daysPerWeek: 3,
    salaryOfferMin: 8000,
    salaryOfferMax: 10000,
    preferredGender: 'any',
    district: 'Dhaka',
    area: 'Dhanmondi',
    detailedAddress: 'Road 8A, Dhanmondi',
    latitude: 23.7465,
    longitude: 90.3742,
    status: 'open',
    applicationCount: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tui_utt_02',
    guardianId: 'usr_grd_002',
    guardianName: 'Rafiqul Islam',
    curriculum: 'bangla-medium',
    gradeLevel: 'HSC 1st Year',
    subjects: ['Chemistry', 'Higher Mathematics'],
    tuitionType: 'home',
    daysPerWeek: 4,
    salaryOfferMin: 9000,
    salaryOfferMax: 12000,
    preferredGender: 'male',
    district: 'Dhaka',
    area: 'Uttara',
    detailedAddress: 'Sector 7, Road 4',
    latitude: 23.8759,
    longitude: 90.3795,
    status: 'open',
    applicationCount: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tui_mir_03',
    guardianId: 'usr_grd_003',
    guardianName: 'Shahana Akter',
    curriculum: 'english-version',
    gradeLevel: 'Class 8',
    subjects: ['General Science', 'Mathematics', 'English'],
    tuitionType: 'both',
    daysPerWeek: 3,
    salaryOfferMin: 7000,
    salaryOfferMax: 8500,
    preferredGender: 'female',
    district: 'Dhaka',
    area: 'Mirpur',
    detailedAddress: 'Mirpur DOHS',
    latitude: 23.8365,
    longitude: 90.3695,
    status: 'open',
    applicationCount: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockApplications: ITuitionApplication[] = [];

export const TuitionModel = {
  async search(filters: ITuitionFilter): Promise<{ tuitions: ITuitionJob[]; total: number }> {
    // Attempt PostGIS query if location given
    if (filters.lat && filters.lon) {
      const radiusMeters = (filters.radiusKm || 10) * 1000;
      try {
        const result = await query<ITuitionJob>(
          `SELECT id, guardian_id as "guardianId", curriculum, grade_level as "gradeLevel",
                  subjects, tuition_type as "tuitionType", days_per_week as "daysPerWeek",
                  salary_offer_min as "salaryOfferMin", salary_offer_max as "salaryOfferMax",
                  preferred_gender as "preferredGender", district, area,
                  detailed_address as "detailedAddress", status,
                  ST_Y(location::geometry) as latitude,
                  ST_X(location::geometry) as longitude,
                  ROUND((ST_Distance(location, ST_MakePoint($1, $2)::geography) / 1000)::numeric, 1) AS "distanceKm",
                  created_at as "createdAt"
           FROM tuitions
           WHERE status = 'open' AND ST_DWithin(location, ST_MakePoint($1, $2)::geography, $3)
           ORDER BY "distanceKm" ASC
           LIMIT $4 OFFSET $5`,
          [
            filters.lon,
            filters.lat,
            radiusMeters,
            filters.limit || 20,
            ((filters.page || 1) - 1) * (filters.limit || 20),
          ]
        );
        if (result.rows.length > 0) {
          return { tuitions: result.rows, total: result.rowCount || result.rows.length };
        }
      } catch {
        // fallback
      }
    }

    let filtered = [...mockTuitions];

    if (filters.district) {
      filtered = filtered.filter(
        (t) => t.district.toLowerCase() === filters.district?.toLowerCase()
      );
    }
    if (filters.area) {
      filtered = filtered.filter((t) =>
        t.area.toLowerCase().includes(filters.area!.toLowerCase())
      );
    }
    if (filters.curriculum) {
      filtered = filtered.filter((t) => t.curriculum === filters.curriculum);
    }
    if (filters.subject) {
      filtered = filtered.filter((t) =>
        t.subjects.some((s) => s.toLowerCase().includes(filters.subject!.toLowerCase()))
      );
    }
    if (filters.minSalary) {
      filtered = filtered.filter((t) => t.salaryOfferMax >= (filters.minSalary || 0));
    }

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    return { tuitions: paginated, total: filtered.length };
  },

  async findById(id: string): Promise<ITuitionJob | null> {
    try {
      const result = await query<ITuitionJob>(
        `SELECT id, guardian_id as "guardianId", curriculum, grade_level as "gradeLevel",
                subjects, tuition_type as "tuitionType", days_per_week as "daysPerWeek",
                salary_offer_min as "salaryOfferMin", salary_offer_max as "salaryOfferMax",
                preferred_gender as "preferredGender", district, area,
                detailed_address as "detailedAddress", status,
                ST_Y(location::geometry) as latitude,
                ST_X(location::geometry) as longitude,
                created_at as "createdAt", updated_at as "updatedAt"
         FROM tuitions
         WHERE id = $1
         LIMIT 1`,
        [id]
      );
      if (result.rows.length > 0) {
        return result.rows[0];
      }
    } catch {
      // fallback
    }

    return mockTuitions.find((t) => t.id === id) || null;
  },

  async create(guardianId: string, guardianName: string, payload: ICreateTuitionPayload): Promise<ITuitionJob> {
    const newJob: ITuitionJob = {
      id: `tui_${Math.random().toString(36).substring(2, 9)}`,
      guardianId,
      guardianName,
      ...payload,
      status: 'open',
      applicationCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockTuitions.unshift(newJob);
    return newJob;
  },

  async apply(tuitionId: string, tutorId: string, tutorName: string, expectedSalary: number, notes?: string): Promise<ITuitionApplication> {
    const app: ITuitionApplication = {
      id: `app_${Math.random().toString(36).substring(2, 9)}`,
      tuitionId,
      tutorId,
      tutorName,
      expectedSalary,
      notes,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    mockApplications.push(app);

    const job = mockTuitions.find((t) => t.id === tuitionId);
    if (job) {
      job.applicationCount += 1;
    }

    return app;
  },
};
