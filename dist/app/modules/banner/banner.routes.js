"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middleware/auth"));
const fileUploadHandler_1 = __importDefault(require("../../middleware/fileUploadHandler"));
const parseFileData_1 = __importDefault(require("../../middleware/parseFileData"));
const files_1 = require("../../../enums/files");
const banner_controller_1 = require("./banner.controller");
const router = express_1.default.Router();
router.route('/').post((0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), (0, fileUploadHandler_1.default)(), (0, parseFileData_1.default)(files_1.FOLDER_NAMES.BANNER), banner_controller_1.BannerControllers.createBanner).get(banner_controller_1.BannerControllers.getBanners);
router.get('/all-banners', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.ADMIN), banner_controller_1.BannerControllers.getAllBanners);
router.patch('/:id/status', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.ADMIN), banner_controller_1.BannerControllers.updateBannerStatus);
router
    .route('/:id')
    .patch((0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), (0, fileUploadHandler_1.default)(), (0, parseFileData_1.default)(files_1.FOLDER_NAMES.BANNER), banner_controller_1.BannerControllers.updateBanner)
    .delete((0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), banner_controller_1.BannerControllers.deleteBanner);
exports.BannerRoutes = router;
