import { query } from '../../db/index.js';
import {
  CurriculumType,
  IPortfolioDocument,
  ITutorPortfolio,
  ITutorProfile,
  ITutorSearchFilter,
  IUploadDocumentPayload,
} from './tutor.interface.js';

// Seed authentic Bangladeshi tutors matching PRODUCT.md & API_GUIDELINES.md
const mockTutors: ITutorProfile[] = [
  {
    id: 'tut_buet_01',
    userId: 'usr_buet_01',
    name: 'Tanvir Ahmed',
    occupationType: 'student',
    university: 'BUET',
    department: 'Computer Science & Engineering',
    gender: 'male',
    district: 'Dhaka',
    area: 'Dhanmondi',
    detailedAddress: 'Road 8A, Dhanmondi',
    latitude: 23.7465,
    longitude: 90.3742,
    tutoringMode: 'both',
    preferredSubjects: ['Higher Mathematics', 'Physics', 'ICT'],
    preferredCurricula: ['bangla-medium', 'english-version'],
    expectedSalaryMin: 8000,
    expectedSalaryMax: 12000,
    experienceYears: 3,
    bio: 'BUET CSE student with 3+ years experience mentoring HSC & SSC candidates in Dhanmondi, Lalmatia, and Mohammadpur.',
    phone: '01712345678',
    email: 'tanvir.buet@example.com',
    isVerified: true,
    rating: 4.9,
    reviewCount: 18,
  },
  {
    id: 'tut_du_02',
    userId: 'usr_du_02',
    name: 'Nusrat Jahan',
    occupationType: 'student',
    university: 'University of Dhaka',
    department: 'English',
    gender: 'female',
    district: 'Dhaka',
    area: 'Uttara',
    detailedAddress: 'Sector 4, Uttara',
    latitude: 23.8683,
    longitude: 90.3983,
    tutoringMode: 'both',
    preferredSubjects: ['English Literature', 'Grammar', 'O-Level English'],
    preferredCurricula: ['english-medium', 'english-version'],
    expectedSalaryMin: 7000,
    expectedSalaryMax: 10000,
    experienceYears: 2,
    bio: 'DU English major specializing in Cambridge & Edexcel O/A Level English Language and Literature.',
    phone: '01819876543',
    email: 'nusrat.du@example.com',
    isVerified: true,
    rating: 4.8,
    reviewCount: 14,
  },
  {
    id: 'tut_dmc_03',
    userId: 'usr_dmc_03',
    name: 'Dr. Shahriar Kabir',
    occupationType: 'professional',
    university: 'Dhaka Medical College',
    department: 'MBBS',
    companyName: 'Dhaka Medical College Hospital',
    designation: 'Internee Doctor',
    gender: 'male',
    district: 'Dhaka',
    area: 'Bhashantek / Mirpur',
    detailedAddress: 'Mirpur 10, Dhaka',
    latitude: 23.8069,
    longitude: 90.3687,
    tutoringMode: 'home',
    preferredSubjects: ['Biology', 'Chemistry', 'Medical Admission Preparation'],
    preferredCurricula: ['bangla-medium', 'english-version', 'admission-test'],
    expectedSalaryMin: 10000,
    expectedSalaryMax: 15000,
    experienceYears: 4,
    bio: 'DMC graduate guiding medical admission aspirants and Class 11-12 Biology and Chemistry students.',
    phone: '01911223344',
    email: 'shahriar.dmc@example.com',
    isVerified: true,
    rating: 5.0,
    reviewCount: 22,
  },
];

export const TutorModel = {
  async search(filters: ITutorSearchFilter): Promise<{ tutors: ITutorProfile[]; total: number }> {
    // Attempt PostGIS spatial query if latitude and longitude provided
    if (filters.lat && filters.lon) {
      const radiusMeters = (filters.radiusKm || 10) * 1000;
      try {
        const result = await query<ITutorProfile>(
          `SELECT id, user_id as "userId", name, occupation_type as "occupationType",
                  university, department, company_name as "companyName", designation,
                  gender, district, area, detailed_address as "detailedAddress",
                  ST_Y(location::geometry) as latitude,
                  ST_X(location::geometry) as longitude,
                  phone, email, is_verified as "isVerified",
                  ROUND((ST_Distance(location, ST_MakePoint($1, $2)::geography) / 1000)::numeric, 1) AS "distanceKm"
           FROM tutors
           WHERE ST_DWithin(location, ST_MakePoint($1, $2)::geography, $3)
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
          return { tutors: result.rows, total: result.rowCount || result.rows.length };
        }
      } catch {
        // Fallback to local memory filtering
      }
    }

    let filtered = [...mockTutors];

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
    if (filters.gender && filters.gender !== 'any') {
      filtered = filtered.filter((t) => t.gender === filters.gender);
    }
    if (filters.curriculum) {
      filtered = filtered.filter((t) =>
        t.preferredCurricula.includes(filters.curriculum as CurriculumType)
      );
    }
    if (filters.subject) {
      filtered = filtered.filter((t) =>
        t.preferredSubjects.some((s) =>
          s.toLowerCase().includes(filters.subject!.toLowerCase())
        )
      );
    }

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    return { tutors: paginated, total: filtered.length };
  },

  async findById(id: string): Promise<ITutorProfile | null> {
    try {
      const result = await query<ITutorProfile>(
        `SELECT id, user_id as "userId", name, occupation_type as "occupationType",
                university, department, company_name as "companyName", designation,
                gender, district, area, detailed_address as "detailedAddress",
                ST_Y(location::geometry) as latitude,
                ST_X(location::geometry) as longitude,
                phone, email, is_verified as "isVerified"
         FROM tutors
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

    const found = mockTutors.find((t) => t.id === id || t.userId === id);
    return found || null;
  },

  async getPortfolio(tutorId: string): Promise<ITutorPortfolio> {
    return {
      tutorId,
      academicCredentials: [
        {
          degree: 'B.Sc. in Computer Science & Engineering',
          institution: 'Bangladesh University of Engineering and Technology (BUET)',
          department: 'CSE',
          passingYear: 2024,
          gpaOrGrade: 'CGPA 3.85 / 4.00',
        },
        {
          degree: 'Higher Secondary Certificate (HSC) - Science',
          institution: 'Notre Dame College, Dhaka',
          department: 'Science',
          passingYear: 2019,
          gpaOrGrade: 'GPA 5.00 (Golden)',
        },
      ],
      teachingAccomplishments: [
        'Mentored 45+ SSC & HSC examinees across Dhanmondi and Lalmatia in Higher Math & Physics.',
        '12 students secured A+ in NCTB Board Exams; 3 students cracked BUET & Medical entrance.',
        'Authored chapter-wise concept notes for Cambridge O-Level Physics 5054.',
      ],
      documents: [
        {
          id: 'doc_buet_id',
          title: 'BUET Student Identity Card',
          documentType: 'student-id',
          fileUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600',
          status: 'verified',
          uploadedAt: '2026-01-15T10:00:00.000Z',
        },
        {
          id: 'doc_nid',
          title: 'National Smart NID Card',
          documentType: 'nid',
          fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600',
          status: 'verified',
          uploadedAt: '2026-01-15T10:05:00.000Z',
        },
      ],
    };
  },

  async addDocument(tutorId: string, payload: IUploadDocumentPayload): Promise<IPortfolioDocument> {
    const doc: IPortfolioDocument = {
      id: `doc_${Math.random().toString(36).substring(2, 9)}`,
      title: payload.title,
      documentType: payload.documentType,
      fileUrl: payload.fileUrl,
      status: 'pending',
      uploadedAt: new Date().toISOString(),
    };
    return doc;
  },

  async createProfile(userId: string, data: Partial<ITutorProfile>): Promise<ITutorProfile> {
    const newTutor: ITutorProfile = {
      id: `tut_${Math.random().toString(36).substring(2, 9)}`,
      userId,
      name: data.name || 'Tutor',
      occupationType: data.occupationType || 'student',
      university: data.university || 'BUET',
      department: data.department || 'CSE',
      companyName: data.companyName,
      designation: data.designation,
      gender: data.gender || 'male',
      district: data.district || 'Dhaka',
      area: data.area || 'Dhanmondi',
      detailedAddress: data.detailedAddress || `${data.area || 'Dhanmondi'}, ${data.district || 'Dhaka'}`,
      latitude: data.latitude || 23.7465,
      longitude: data.longitude || 90.3742,
      tutoringMode: data.tutoringMode || 'both',
      preferredSubjects: data.preferredSubjects || ['Mathematics', 'Physics'],
      preferredCurricula: data.preferredCurricula || ['bangla-medium', 'english-version'],
      expectedSalaryMin: data.expectedSalaryMin || 8000,
      expectedSalaryMax: data.expectedSalaryMax || 12000,
      experienceYears: data.experienceYears || 1,
      bio: data.bio || 'Passionate tutor dedicated to conceptual clarity and student success.',
      phone: data.phone || '',
      email: data.email,
      isVerified: true,
      rating: 5.0,
      reviewCount: 1,
    };
    mockTutors.unshift(newTutor);
    return newTutor;
  },

  async updateProfile(userId: string, data: Partial<ITutorProfile>): Promise<ITutorProfile> {
    const existing = await this.findById(userId);
    const updated: ITutorProfile = {
      ...(existing || mockTutors[0]),
      ...data,
      userId,
    };
    return updated;
  },
};
