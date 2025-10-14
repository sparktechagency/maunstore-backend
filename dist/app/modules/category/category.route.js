"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_1 = require("../../../enums/user");
const category_controller_1 = require("./category.controller");
const fileUploadHandler_1 = __importDefault(require("../../middleware/fileUploadHandler"));
const parseFileData_1 = __importDefault(require("../../middleware/parseFileData"));
const files_1 = require("../../../enums/files");
const router = express_1.default.Router();
router
    .route('/')
    .post((0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), (0, fileUploadHandler_1.default)(), (0, parseFileData_1.default)(files_1.FOLDER_NAMES.IMAGE), category_controller_1.CategoryControllers.createCategory)
    .get(category_controller_1.CategoryControllers.getAllCategories);
router
    .route('/:id')
    .get(category_controller_1.CategoryControllers.getCategoryById)
    .patch((0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), (0, fileUploadHandler_1.default)(), (0, parseFileData_1.default)(files_1.FOLDER_NAMES.IMAGE), category_controller_1.CategoryControllers.updateCategoryById)
    .delete((0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), category_controller_1.CategoryControllers.deleteCategoryById);
router.get('/brands/:brandId', category_controller_1.CategoryControllers.getCategoryByBrands);
exports.CategoryRoutes = router;
