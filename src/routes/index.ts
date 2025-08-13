import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { AdminRoutes } from '../app/modules/admin/admin.route';
import { FaqRoutes } from '../app/modules/faq/faq.route';
import { BannerRoutes } from '../app/modules/banner/banner.routes';
import { RuleRoutes } from '../app/modules/rule/rule.route';
import { NewsRoutes } from '../app/modules/news/news.route';
import { BrandRoutes } from '../app/modules/brand/brand.route';
import { ProductRoutes } from '../app/modules/product/product.route';
import { ReviewRoutes } from '../app/modules/review/review.routes';
import { ChatRoutes } from '../app/modules/chat/chat.route';
import { MessageRoutes } from '../app/modules/message/message.route';
import { BookmarkRoutes } from '../app/modules/bookmark/bookmark.route';
import { CategoryRoutes } from '../app/modules/category/category.route';

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
          path: '/rules',
          route: RuleRoutes,
     },
     {
          path: '/faqs',
          route: FaqRoutes,
     },
     {
          path: '/banners',
          route: BannerRoutes,
     },
     {
          path: '/news',
          route: NewsRoutes,
     },
     {
          path: '/brands',
          route: BrandRoutes,
     },
     {
          path: '/products',
          route: ProductRoutes,
     },
     {
          path: '/reviews',
          route: ReviewRoutes,
     },
     {
          path: '/chats',
          route: ChatRoutes,
     },
     {
          path: '/messages',
          route: MessageRoutes,
     },
     {
          path: '/bookmarks',
          route: BookmarkRoutes,
     },
     {
          path: "/categories",
          route: CategoryRoutes,
     }
];

routes.forEach((element) => {
     if (element?.path && element?.route) {
          router.use(element?.path, element?.route);
     }
});

export default router;
