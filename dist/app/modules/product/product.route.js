"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_1 = require("../../../enums/user");
const product_controller_1 = require("./product.controller");
const fileUploadHandler_1 = __importDefault(require("../../middleware/fileUploadHandler"));
const parseMultipleFiledata_1 = __importDefault(require("../../middleware/parseMultipleFiledata"));
const files_1 = require("../../../enums/files");
const router = express_1.default.Router();
router
    .route('/')
    .post((0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.ADMIN), (0, fileUploadHandler_1.default)(), (0, parseMultipleFiledata_1.default)(files_1.FOLDER_NAMES.IMAGES), product_controller_1.ProductControllers.createProduct)
    .get((0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), product_controller_1.ProductControllers.getProducts);
router.get('/:categoryId/products', (0, auth_1.default)(user_1.USER_ROLES.USER, user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), product_controller_1.ProductControllers.getProductsByBrand);
router
    .route('/:id')
    .get((0, auth_1.default)(user_1.USER_ROLES.USER, user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.SUPER_ADMIN), product_controller_1.ProductControllers.getProductById)
    .patch((0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.ADMIN), (0, fileUploadHandler_1.default)(), (0, parseMultipleFiledata_1.default)(files_1.FOLDER_NAMES.IMAGES), product_controller_1.ProductControllers.updateProductById)
    .delete((0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.ADMIN), (0, fileUploadHandler_1.default)(), (0, parseMultipleFiledata_1.default)(files_1.FOLDER_NAMES.IMAGES), product_controller_1.ProductControllers.deleteProductById);
exports.ProductRoutes = router;
