import { Router } from 'express';
import { AuthRoutes } from './modules/auth/auth.routes.js';
import { GuardianRoutes } from './modules/guardian/guardian.routes.js';
import { TuitionRoutes } from './modules/tuition/tuition.routes.js';
import { TutorRoutes } from './modules/tutor/tutor.routes.js';
import { UserRoutes } from './modules/user/user.routes.js';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/tutors',
    route: TutorRoutes,
  },
  {
    path: '/guardians',
    route: GuardianRoutes,
  },
  {
    path: '/tuitions',
    route: TuitionRoutes,
  },
];

moduleRoutes.forEach((item) => {
  router.use(item.path, item.route);
});

export const globalRoutes = router;
export default router;
