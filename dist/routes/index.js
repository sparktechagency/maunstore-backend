"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../app/modules/auth/auth.route");
const user_route_1 = require("../app/modules/user/user.route");
const admin_route_1 = require("../app/modules/admin/admin.route");
const faq_route_1 = require("../app/modules/faq/faq.route");
const banner_routes_1 = require("../app/modules/banner/banner.routes");
const rule_route_1 = require("../app/modules/rule/rule.route");
const news_route_1 = require("../app/modules/news/news.route");
const brand_route_1 = require("../app/modules/brand/brand.route");
const product_route_1 = require("../app/modules/product/product.route");
const review_routes_1 = require("../app/modules/review/review.routes");
const chat_route_1 = require("../app/modules/chat/chat.route");
const message_route_1 = require("../app/modules/message/message.route");
const bookmark_route_1 = require("../app/modules/bookmark/bookmark.route");
const category_route_1 = require("../app/modules/category/category.route");
const settings_route_1 = require("../app/modules/settings/settings.route");
const router = express_1.default.Router();
const routes = [
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/users',
        route: user_route_1.UserRoutes,
    },
    {
        path: '/admins',
        route: admin_route_1.AdminRoutes,
    },
    {
        path: '/rules',
        route: rule_route_1.RuleRoutes,
    },
    {
        path: '/faqs',
        route: faq_route_1.FaqRoutes,
    },
    {
        path: '/banners',
        route: banner_routes_1.BannerRoutes,
    },
    {
        path: '/news',
        route: news_route_1.NewsRoutes,
    },
    {
        path: '/brands',
        route: brand_route_1.BrandRoutes,
    },
    {
        path: '/products',
        route: product_route_1.ProductRoutes,
    },
    {
        path: '/reviews',
        route: review_routes_1.ReviewRoutes,
    },
    {
        path: '/chats',
        route: chat_route_1.ChatRoutes,
    },
    {
        path: '/messages',
        route: message_route_1.MessageRoutes,
    },
    {
        path: '/bookmarks',
        route: bookmark_route_1.BookmarkRoutes,
    },
    {
        path: '/categories',
        route: category_route_1.CategoryRoutes,
    },
    {
        path: "/settings",
        route: settings_route_1.SettingRoutes
    }
];
routes.forEach((element) => {
    if ((element === null || element === void 0 ? void 0 : element.path) && (element === null || element === void 0 ? void 0 : element.route)) {
        router.use(element === null || element === void 0 ? void 0 : element.path, element === null || element === void 0 ? void 0 : element.route);
    }
});
exports.default = router;
