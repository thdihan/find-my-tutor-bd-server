import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { AuthController } from './auth.controller.js';

const registerValidationSchema = z.object({
  body: z.object({
    role: z.enum(['guardian', 'tutor', 'admin']),
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    phone: z
      .string()
      .regex(/^(?:\+8801|01)[3-9]\d{8}$/, 'Invalid Bangladeshi mobile phone format. Expected 01XXXXXXXXX'),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    district: z.string().optional().or(z.literal('')),
    area: z.string().optional().or(z.literal('')),
    curriculum: z
      .enum(['bangla-medium', 'english-version', 'english-medium', 'madrasah', 'admission-test'])
      .optional()
      .or(z.literal('')),
    occupationType: z.enum(['student', 'professional']).optional().or(z.literal('')),
    university: z.string().optional().or(z.literal('')),
    department: z.string().optional().or(z.literal('')),
    companyName: z.string().nullable().optional(),
    designation: z.string().nullable().optional(),
    tutoringMode: z.enum(['home', 'online', 'both']).optional().or(z.literal('')),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    identifier: z.string().min(3, 'Email or Phone is required'),
    password: z.string().min(1, 'Password is required'),
    role: z.enum(['guardian', 'tutor', 'admin']).optional(),
  }),
});

const router = Router();

router.post('/register', validateRequest(registerValidationSchema), AuthController.registerUser);
router.post('/login', validateRequest(loginValidationSchema), AuthController.loginUser);
router.post('/google', AuthController.googleAuth);
router.post('/refresh', AuthController.refreshToken);
router.post('/logout', AuthController.logoutUser);

export const AuthRoutes = router;
export default router;
