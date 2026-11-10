import { CurriculumType } from '../tutor/tutor.interface.js';

export interface ITuitionJob {
  id: string;
  guardianId: string;
  guardianName: string;
  curriculum: CurriculumType;
  gradeLevel: string;
  subjects: string[];
  tuitionType: 'home' | 'online' | 'both';
  daysPerWeek: number;
  salaryOfferMin: number;
  salaryOfferMax: number;
  preferredGender: 'male' | 'female' | 'any';
  district: string;
  area: string;
  detailedAddress?: string;
  latitude?: number;
  longitude?: number;
  status: 'open' | 'matched' | 'closed';
  applicationCount: number;
  createdAt: string;
  updatedAt: string;
  distanceKm?: number;
}

export interface ICreateTuitionPayload {
  curriculum: CurriculumType;
  gradeLevel: string;
  subjects: string[];
  tuitionType: 'home' | 'online' | 'both';
  daysPerWeek: number;
  salaryOfferMin: number;
  salaryOfferMax: number;
  preferredGender: 'male' | 'female' | 'any';
  district: string;
  area: string;
  detailedAddress?: string;
  latitude?: number;
  longitude?: number;
}

export interface ITuitionFilter {
  curriculum?: string;
  district?: string;
  area?: string;
  subject?: string;
  minSalary?: number;
  maxSalary?: number;
  tuitionType?: string;
  lat?: number;
  lon?: number;
  radiusKm?: number;
  page?: number;
  limit?: number;
}

export interface ITuitionApplication {
  id: string;
  tuitionId: string;
  tutorId: string;
  tutorName: string;
  expectedSalary: number;
  notes?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}
