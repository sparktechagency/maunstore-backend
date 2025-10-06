"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_1 = require("../../../enums/user");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const user_validation_1 = require("../user/user.validation");
const admin_controller_1 = require("./admin.controller");
const parseFileData_1 = __importDefault(require("../../middleware/parseFileData"));
const fileUploadHandler_1 = __importDefault(require("../../middleware/fileUploadHandler"));
const files_1 = require("../../../enums/files");
const router = express_1.default.Router();
router
    .route('/')
    .post((0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.ADMIN), (0, validateRequest_1.default)(user_validation_1.UserValidation.createUserZodSchema), admin_controller_1.AdminControllers.createAdmin)
    .get((0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.ADMIN), admin_controller_1.AdminControllers.getAdmins);
router
    .route('/:id')
    .patch((0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), (0, fileUploadHandler_1.default)(), (0, parseFileData_1.default)(files_1.FOLDER_NAMES.PROFILEIMAGE), admin_controller_1.AdminControllers.updateAdmin)
    .delete((0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), admin_controller_1.AdminControllers.deleteAdmin);
router.patch('/status/:id', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), admin_controller_1.AdminControllers.updateAdminStatus);
exports.AdminRoutes = router;
