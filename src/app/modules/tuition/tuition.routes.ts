import { Router } from 'express';
import { z } from 'zod';
import { auth } from '../../middlewares/auth.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { TuitionController } from './tuition.controller.js';

const createTuitionValidationSchema = z.object({
  body: z.object({
    curriculum: z.enum([
      'bangla-medium',
      'english-version',
      'english-medium',
      'madrasah',
      'admission-test',
    ]),
    gradeLevel: z.string().min(1, 'Grade level is required (e.g., Class 9, HSC 1st Year)'),
    subjects: z.array(z.string()).min(1, 'At least one subject is required'),
    tuitionType: z.enum(['home', 'online', 'both']),
    daysPerWeek: z.number().min(1).max(7),
    salaryOfferMin: z.number().positive(),
    salaryOfferMax: z.number().positive(),
    preferredGender: z.enum(['male', 'female', 'any']),
    district: z.string().min(2, 'District is required'),
    area: z.string().min(2, 'Area is required'),
    detailedAddress: z.string().optional(),
    latitude: z.number().min(20).max(27).optional(),
    longitude: z.number().min(88).max(93).optional(),
  }),
});

const applyTuitionValidationSchema = z.object({
  body: z.object({
    expectedSalary: z.number().positive('Expected salary must be greater than zero'),
    notes: z.string().optional(),
  }),
});

const router = Router();

// Publicly browse open tuition jobs
router.get('/', TuitionController.searchTuitions);
router.get('/:id', TuitionController.getTuitionById);

// Guardian posts a new tuition
router.post(
  '/',
  auth('guardian'),
  validateRequest(createTuitionValidationSchema),
  TuitionController.createTuition
);

// Tutor applies for an open tuition
router.post(
  '/:id/apply',
  auth('tutor'),
  validateRequest(applyTuitionValidationSchema),
  TuitionController.applyForTuition
);

export const TuitionRoutes = router;
export default router;
