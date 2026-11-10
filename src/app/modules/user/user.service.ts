import { AppError } from '../../errors/AppError.js';
import { IUpdateUserPayload, IUserProfile } from './user.interface.js';
import { UserModel } from './user.model.js';

export const UserService = {
  async getMyProfile(userId: string): Promise<IUserProfile> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError(404, 'User profile not found.');
    }
    return user;
  },

  async updateMyProfile(userId: string, payload: IUpdateUserPayload): Promise<IUserProfile> {
    const updated = await UserModel.updateUser(userId, payload);
    if (!updated) {
      throw new AppError(404, 'User not found to update.');
    }
    return updated;
  },
};
