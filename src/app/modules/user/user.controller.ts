import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync.js';
import { sendResponse } from '../../utils/sendResponse.js';
import { UserService } from './user.service.js';

export const UserController = {
  getMyProfile: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const result = await UserService.getMyProfile(userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Profile fetched successfully.',
      data: result,
    });
  }),

  updateMyProfile: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const result = await UserService.updateMyProfile(userId, req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Profile updated successfully.',
      data: result,
    });
  }),
};
