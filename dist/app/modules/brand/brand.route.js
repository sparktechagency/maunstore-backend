"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_1 = require("../../../enums/user");
const brand_controller_1 = require("./brand.controller");
const fileUploadHandler_1 = __importDefault(require("../../middleware/fileUploadHandler"));
const parseFileData_1 = __importDefault(require("../../middleware/parseFileData"));
const files_1 = require("../../../enums/files");
const router = express_1.default.Router();
router.route('/').post((0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.ADMIN), (0, fileUploadHandler_1.default)(), (0, parseFileData_1.default)(files_1.FOLDER_NAMES.IMAGE), brand_controller_1.BrandControllers.createBrand).get(brand_controller_1.BrandControllers.getBrands);
router
    .route('/:id')
    .get(brand_controller_1.BrandControllers.getBrandById)
    .patch((0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), (0, fileUploadHandler_1.default)(), (0, parseFileData_1.default)(files_1.FOLDER_NAMES.IMAGE), brand_controller_1.BrandControllers.updateBrandById)
    .delete((0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), brand_controller_1.BrandControllers.deleteBrand);
exports.BrandRoutes = router;
