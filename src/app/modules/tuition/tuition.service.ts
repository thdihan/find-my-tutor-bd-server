import { AppError } from '../../errors/AppError.js';
import { ICreateTuitionPayload, ITuitionFilter, ITuitionJob } from './tuition.interface.js';
import { TuitionModel } from './tuition.model.js';

export const TuitionService = {
  async searchTuitions(filters: ITuitionFilter) {
    return TuitionModel.search(filters);
  },

  async getTuitionById(id: string): Promise<ITuitionJob> {
    const tuition = await TuitionModel.findById(id);
    if (!tuition) {
      throw new AppError(404, 'Tuition job post not found.');
    }
    return tuition;
  },

  async createTuition(
    guardianId: string,
    guardianName: string,
    payload: ICreateTuitionPayload
  ): Promise<ITuitionJob> {
    if (payload.salaryOfferMin > payload.salaryOfferMax) {
      throw new AppError(400, 'Minimum salary offer cannot exceed maximum salary offer.');
    }
    return TuitionModel.create(guardianId, guardianName, payload);
  },

  async applyForTuition(
    tuitionId: string,
    tutorId: string,
    tutorName: string,
    expectedSalary: number,
    notes?: string
  ) {
    const job = await TuitionModel.findById(tuitionId);
    if (!job) {
      throw new AppError(404, 'Tuition job post not found.');
    }
    if (job.status !== 'open') {
      throw new AppError(400, 'This tuition job is no longer accepting applications.');
    }

    return TuitionModel.apply(tuitionId, tutorId, tutorName, expectedSalary, notes);
  },
};
