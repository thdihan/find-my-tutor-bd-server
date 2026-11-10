import { Router } from 'express';
import { auth } from '../../middlewares/auth.js';
import { TutorController } from './tutor.controller.js';

const router = Router();

// Public routes
router.get('/', TutorController.searchTutors);

// Authenticated tutor routes
router.get('/me', auth('tutor'), TutorController.getTutorMe);
router.put('/me', auth('tutor'), TutorController.updateTutorMe);
router.get('/me/portfolio', auth('tutor'), TutorController.getMyPortfolio);
router.post('/me/portfolio/documents', auth('tutor'), TutorController.uploadPortfolioDocument);

// Tutor details by ID
router.get('/:id', TutorController.getTutorById);

export const TutorRoutes = router;
export default router;
