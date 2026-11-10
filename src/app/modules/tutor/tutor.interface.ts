export type CurriculumType =
  | 'bangla-medium'
  | 'english-version'
  | 'english-medium'
  | 'madrasah'
  | 'admission-test';

export interface ITutorProfile {
  id: string;
  userId: string;
  name: string;
  occupationType: 'student' | 'professional';
  university?: string;
  department?: string;
  companyName?: string;
  designation?: string;
  gender: 'male' | 'female' | 'other';
  district: string;
  area: string;
  detailedAddress?: string;
  latitude?: number;
  longitude?: number;
  tutoringMode: 'home' | 'online' | 'both';
  preferredSubjects: string[];
  preferredCurricula: CurriculumType[];
  expectedSalaryMin: number;
  expectedSalaryMax: number;
  experienceYears: number;
  bio?: string;
  phone: string;
  email?: string;
  isVerified: boolean;
  rating?: number;
  reviewCount?: number;
  distanceKm?: number;
}

export interface ITutorSearchFilter {
  curriculum?: string;
  district?: string;
  area?: string;
  subject?: string;
  gender?: string;
  tutoringMode?: string;
  lat?: number;
  lon?: number;
  radiusKm?: number;
  page?: number;
  limit?: number;
}

export interface IPortfolioDocument {
  id: string;
  title: string;
  documentType: 'nid' | 'student-id' | 'transcript' | 'certificate';
  fileUrl: string;
  status: 'pending' | 'verified' | 'rejected';
  uploadedAt: string;
}

export interface ITutorPortfolio {
  tutorId: string;
  academicCredentials: {
    degree: string;
    institution: string;
    department: string;
    passingYear: number;
    gpaOrGrade: string;
  }[];
  teachingAccomplishments: string[];
  documents: IPortfolioDocument[];
}

export interface IUploadDocumentPayload {
  title: string;
  documentType: 'nid' | 'student-id' | 'transcript' | 'certificate';
  fileUrl: string;
}
