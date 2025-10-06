"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const user_validation_1 = require("./user.validation");
const auth_1 = __importDefault(require("../../middleware/auth"));
const fileUploadHandler_1 = __importDefault(require("../../middleware/fileUploadHandler"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const parseFileData_1 = __importDefault(require("../../middleware/parseFileData"));
const files_1 = require("../../../enums/files");
const user_controller_1 = require("./user.controller");
const router = express_1.default.Router();
router
    .route('/profile')
    .get((0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.USER, user_1.USER_ROLES.SUPER_ADMIN), user_controller_1.UserControllers.getUserProfile)
    .patch((0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.USER), (0, fileUploadHandler_1.default)(), (0, parseFileData_1.default)(files_1.FOLDER_NAMES.PROFILEIMAGE), (0, validateRequest_1.default)(user_validation_1.UserValidation.updateUserZodSchema), user_controller_1.UserControllers.updateProfile)
    .delete((0, auth_1.default)(user_1.USER_ROLES.USER, user_1.USER_ROLES.ADMIN), user_controller_1.UserControllers.deleteProfile);
router.route('/').post((0, validateRequest_1.default)(user_validation_1.UserValidation.createUserZodSchema), user_controller_1.UserControllers.createUser).get((0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.ADMIN), user_controller_1.UserControllers.getUsers);
router
    .route('/:id')
    .get((0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.ADMIN), user_controller_1.UserControllers.getUserById)
    .patch((0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.ADMIN), (0, fileUploadHandler_1.default)(), (0, parseFileData_1.default)(files_1.FOLDER_NAMES.PROFILEIMAGE), user_controller_1.UserControllers.updateUser)
    .delete((0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.ADMIN), user_controller_1.UserControllers.deleteUser);
router.route('/status/:id').patch((0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.ADMIN), user_controller_1.UserControllers.updateUserStatus);
exports.UserRoutes = router;
