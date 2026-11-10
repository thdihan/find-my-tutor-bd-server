import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync.js';
import { sendResponse } from '../../utils/sendResponse.js';
import { GuardianService } from './guardian.service.js';

export const GuardianController = {
  getGuardianMe: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const result = await GuardianService.getGuardianMe(userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Guardian profile retrieved successfully.',
      data: result,
    });
  }),

  updateGuardianMe: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const result = await GuardianService.updateGuardianMe(userId, req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Guardian profile updated successfully.',
      data: result,
    });
  }),
};
