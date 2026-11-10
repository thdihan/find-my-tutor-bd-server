export interface IStudentInfo {
  name: string;
  gradeLevel: string;
  curriculum: 'bangla-medium' | 'english-version' | 'english-medium' | 'madrasah';
  institution?: string;
}

export interface IGuardianProfile {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  email?: string;
  district: string;
  area: string;
  detailedAddress?: string;
  latitude?: number;
  longitude?: number;
  students: IStudentInfo[];
  createdAt: string;
  updatedAt: string;
}

export interface IUpdateGuardianPayload {
  fullName?: string;
  district?: string;
  area?: string;
  detailedAddress?: string;
  latitude?: number;
  longitude?: number;
  students?: IStudentInfo[];
}
