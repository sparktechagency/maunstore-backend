import express from 'express';
import SettingsRouter from '../app/modules/settings/settings.route';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';

const router = express.Router();
const routes = [
     {
          path: '/auth',
          route: AuthRoutes,
     },
     {
          path: '/users',
          route: UserRoutes,
     },
     {
          path: '/settings',
          route: SettingsRouter,
     },
];

routes.forEach((element) => {
     if (element?.path && element?.route) {
          router.use(element?.path, element?.route);
     }
});

export default router;
