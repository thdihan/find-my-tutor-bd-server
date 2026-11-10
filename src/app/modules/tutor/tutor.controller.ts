import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync.js';
import { sendResponse } from '../../utils/sendResponse.js';
import { TutorService } from './tutor.service.js';

export const TutorController = {
  searchTutors: catchAsync(async (req: Request, res: Response) => {
    const filters = {
      curriculum: req.query.curriculum as string,
      district: req.query.district as string,
      area: req.query.area as string,
      subject: req.query.subject as string,
      gender: req.query.gender as string,
      tutoringMode: req.query.tutoringMode as string,
      lat: req.query.lat ? parseFloat(req.query.lat as string) : undefined,
      lon: req.query.lon ? parseFloat(req.query.lon as string) : undefined,
      radiusKm: req.query.radiusKm ? parseFloat(req.query.radiusKm as string) : undefined,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 20,
    };

    const result = await TutorService.searchTutors(filters);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Tutors retrieved successfully.',
      meta: {
        page: filters.page,
        limit: filters.limit,
        total: result.total,
        totalPage: Math.ceil(result.total / filters.limit),
      },
      data: result.tutors,
    });
  }),

  getTutorById: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await TutorService.getTutorById(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Tutor profile retrieved successfully.',
      data: result,
    });
  }),

  getTutorMe: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const result = await TutorService.getTutorMe(userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Authenticated tutor profile retrieved successfully.',
      data: result,
    });
  }),

  updateTutorMe: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const result = await TutorService.updateTutorMe(userId, req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Tutor profile updated successfully.',
      data: result,
    });
  }),

  getMyPortfolio: catchAsync(async (req: Request, res: Response) => {
    const tutorId = req.user?.userId as string;
    const result = await TutorService.getPortfolio(tutorId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Tutor portfolio retrieved successfully.',
      data: result,
    });
  }),

  uploadPortfolioDocument: catchAsync(async (req: Request, res: Response) => {
    const tutorId = req.user?.userId as string;
    const result = await TutorService.uploadDocument(tutorId, req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Portfolio document submitted for verification successfully.',
      data: result,
    });
  }),
};
