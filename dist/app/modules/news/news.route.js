"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_1 = require("../../../enums/user");
const news_controller_1 = require("./news.controller");
const files_1 = require("../../../enums/files");
const parseFileData_1 = __importDefault(require("../../middleware/parseFileData"));
const fileUploadHandler_1 = __importDefault(require("../../middleware/fileUploadHandler"));
const router = express_1.default.Router();
router.route('/').post((0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.ADMIN), (0, fileUploadHandler_1.default)(), (0, parseFileData_1.default)(files_1.FOLDER_NAMES.IMAGE), news_controller_1.NewsControllers.createNews).get(news_controller_1.NewsControllers.getNews);
router
    .route('/:id')
    .get(news_controller_1.NewsControllers.getNewsByd)
    .patch((0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), (0, fileUploadHandler_1.default)(), (0, parseFileData_1.default)(files_1.FOLDER_NAMES.IMAGE), news_controller_1.NewsControllers.updateNewsById)
    .delete((0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.ADMIN), news_controller_1.NewsControllers.deleteNewsById);
exports.NewsRoutes = router;
