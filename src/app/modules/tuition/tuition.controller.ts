import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync.js';
import { sendResponse } from '../../utils/sendResponse.js';
import { TuitionService } from './tuition.service.js';

export const TuitionController = {
  searchTuitions: catchAsync(async (req: Request, res: Response) => {
    const filters = {
      curriculum: req.query.curriculum as string,
      district: req.query.district as string,
      area: req.query.area as string,
      subject: req.query.subject as string,
      minSalary: req.query.minSalary ? parseInt(req.query.minSalary as string, 10) : undefined,
      maxSalary: req.query.maxSalary ? parseInt(req.query.maxSalary as string, 10) : undefined,
      tuitionType: req.query.tuitionType as string,
      lat: req.query.lat ? parseFloat(req.query.lat as string) : undefined,
      lon: req.query.lon ? parseFloat(req.query.lon as string) : undefined,
      radiusKm: req.query.radiusKm ? parseFloat(req.query.radiusKm as string) : undefined,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 20,
    };

    const result = await TuitionService.searchTuitions(filters);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Tuition jobs retrieved successfully.',
      meta: {
        page: filters.page,
        limit: filters.limit,
        total: result.total,
        totalPage: Math.ceil(result.total / filters.limit),
      },
      data: result.tuitions,
    });
  }),

  getTuitionById: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await TuitionService.getTuitionById(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Tuition job details retrieved successfully.',
      data: result,
    });
  }),

  createTuition: catchAsync(async (req: Request, res: Response) => {
    const guardianId = req.user?.userId as string;
    const guardianName = req.body.guardianName || 'Guardian';
    const result = await TuitionService.createTuition(guardianId, guardianName, req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Tuition job posted successfully.',
      data: result,
    });
  }),

  applyForTuition: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const tutorId = req.user?.userId as string;
    const tutorName = req.body.tutorName || 'Verified Tutor';
    const expectedSalary = req.body.expectedSalary;
    const notes = req.body.notes;

    const result = await TuitionService.applyForTuition(
      id,
      tutorId,
      tutorName,
      expectedSalary,
      notes
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Tuition application submitted successfully.',
      data: result,
    });
  }),
};
