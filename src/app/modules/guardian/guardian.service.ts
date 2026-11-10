import { AppError } from '../../errors/AppError.js';
import { IGuardianProfile, IUpdateGuardianPayload } from './guardian.interface.js';
import { GuardianModel } from './guardian.model.js';

export const GuardianService = {
  async getGuardianMe(userId: string): Promise<IGuardianProfile> {
    const guardian = await GuardianModel.findByUserId(userId);
    if (!guardian) {
      throw new AppError(404, 'Guardian profile not found.');
    }
    return guardian;
  },

  async updateGuardianMe(userId: string, payload: IUpdateGuardianPayload): Promise<IGuardianProfile> {
    return GuardianModel.updateProfile(userId, payload);
  },
};
