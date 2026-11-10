import { Router } from 'express';
import { auth } from '../../middlewares/auth.js';
import { GuardianController } from './guardian.controller.js';

const router = Router();

router.get('/me', auth('guardian'), GuardianController.getGuardianMe);
router.put('/me', auth('guardian'), GuardianController.updateGuardianMe);

export const GuardianRoutes = router;
export default router;
