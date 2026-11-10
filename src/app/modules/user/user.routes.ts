import { Router } from 'express';
import { z } from 'zod';
import { auth } from '../../middlewares/auth.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { UserController } from './user.controller.js';

const updateUserValidationSchema = z.object({
  body: z.object({
    fullName: z.string().min(2).optional(),
    email: z.string().email().optional(),
    avatarUrl: z.string().url().optional(),
  }),
});

const router = Router();

router.get('/me', auth('guardian', 'tutor', 'admin'), UserController.getMyProfile);
router.patch(
  '/me',
  auth('guardian', 'tutor', 'admin'),
  validateRequest(updateUserValidationSchema),
  UserController.updateMyProfile
);

export const UserRoutes = router;
export default router;
