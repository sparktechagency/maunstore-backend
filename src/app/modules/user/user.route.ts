import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import { UserValidation } from './user.validation';
import auth from '../../middleware/auth';
import fileUploadHandler from '../../middleware/fileUploadHandler';
import validateRequest from '../../middleware/validateRequest';
import parseFileData from '../../middleware/parseFileData';
import { FOLDER_NAMES } from '../../../enums/files';
import { UserControllers } from './user.controller';
const router = express.Router();

router
     .route('/profile')
     .get(auth(USER_ROLES.ADMIN, USER_ROLES.USER), UserControllers.getUserProfile)
     .patch(
          auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER),
          fileUploadHandler(),
          parseFileData(FOLDER_NAMES.PROFILEIMAGE),
          validateRequest(UserValidation.updateUserZodSchema),
          UserControllers.updateProfile,
     );

router.route('/').post(validateRequest(UserValidation.createUserZodSchema), UserControllers.createUser);

// Admin routes for user management
router.route('/admin').post(auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), validateRequest(UserValidation.createUserZodSchema), UserControllers.createAdmin);

export const UserRoutes = router;
