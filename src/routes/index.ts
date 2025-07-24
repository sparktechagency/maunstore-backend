import express from 'express';
import SettingsRouter from '../app/modules/settings/settings.route';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { AdminRoutes } from '../app/modules/admin/admin.route';
import { FaqRoutes } from '../app/modules/faq/faq.route';
import { BannerRoutes } from '../app/modules/banner/banner.routes';

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
          path: '/admins',
          route: AdminRoutes,
     },
     {
          path: '/settings',
          route: SettingsRouter,
     },
     {
          path: "/faqs",
          route: FaqRoutes
     },
     {
          path: "/banners",
          route: BannerRoutes
     }
];

routes.forEach((element) => {
     if (element?.path && element?.route) {
          router.use(element?.path, element?.route);
     }
});

export default router;
