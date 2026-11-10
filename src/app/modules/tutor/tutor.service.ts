import { AppError } from '../../errors/AppError.js';
import {
  ITutorPortfolio,
  ITutorProfile,
  ITutorSearchFilter,
  IUploadDocumentPayload,
} from './tutor.interface.js';
import { TutorModel } from './tutor.model.js';

export const TutorService = {
  async searchTutors(filters: ITutorSearchFilter) {
    return TutorModel.search(filters);
  },

  async getTutorById(id: string): Promise<ITutorProfile> {
    const tutor = await TutorModel.findById(id);
    if (!tutor) {
      throw new AppError(404, 'Tutor not found with the requested ID.');
    }
    return tutor;
  },

  async getTutorMe(userId: string): Promise<ITutorProfile> {
    const tutor = await TutorModel.findById(userId);
    if (!tutor) {
      throw new AppError(404, 'Tutor profile not found for the authenticated user.');
    }
    return tutor;
  },

  async updateTutorMe(userId: string, data: Partial<ITutorProfile>): Promise<ITutorProfile> {
    return TutorModel.updateProfile(userId, data);
  },

  async getPortfolio(tutorId: string): Promise<ITutorPortfolio> {
    return TutorModel.getPortfolio(tutorId);
  },

  async uploadDocument(tutorId: string, payload: IUploadDocumentPayload) {
    return TutorModel.addDocument(tutorId, payload);
  },
};
