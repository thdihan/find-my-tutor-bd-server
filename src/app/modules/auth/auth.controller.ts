import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync.js';
import { sendResponse } from '../../utils/sendResponse.js';
import { AuthService } from './auth.service.js';

export const AuthController = {
  registerUser: catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.register(req.body);

    // Set secure HTTP-only refresh token cookie
    res.cookie('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Account created successfully.',
      data: result,
    });
  }),

  loginUser: catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body);

    res.cookie('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Login successful.',
      data: result,
    });
  }),

  googleAuth: catchAsync(async (req: Request, res: Response) => {
    const { idToken, role } = req.body;
    const result = await AuthService.googleAuth(idToken, role);

    res.cookie('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Google authentication successful.',
      data: result,
    });
  }),

  refreshToken: catchAsync(async (req: Request, res: Response) => {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    const result = await AuthService.refresh(token);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Access token refreshed successfully.',
      data: result,
    });
  }),

  logoutUser: catchAsync(async (_req: Request, res: Response) => {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Logged out successfully.',
      data: null,
    });
  }),
};
