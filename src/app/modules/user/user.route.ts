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
     .get(auth(USER_ROLES.ADMIN, USER_ROLES.USER, USER_ROLES.SUPER_ADMIN), UserControllers.getUserProfile)
     .patch(
          auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER),
          fileUploadHandler(),
          parseFileData(FOLDER_NAMES.PROFILEIMAGE),
          validateRequest(UserValidation.updateUserZodSchema),
          UserControllers.updateProfile,
     );

router.route('/').post(validateRequest(UserValidation.createUserZodSchema), UserControllers.createUser).get(auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), UserControllers.getUsers);

router
     .route('/:id')
     .get(auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), UserControllers.getUserById)
     .patch(auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), fileUploadHandler(), parseFileData(FOLDER_NAMES.PROFILEIMAGE), UserControllers.updateUser)
     .delete(auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), UserControllers.deleteUser);

router.route('/status/:id').patch(auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), UserControllers.updateUserStatus);

// admin management
router
     .route('/admin')
     .post(auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), validateRequest(UserValidation.createUserZodSchema), UserControllers.createAdmin)
     .get(auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), UserControllers.getAdmins);

router
     .route('/admin/:id')
     .patch(auth(USER_ROLES.SUPER_ADMIN), fileUploadHandler(), parseFileData(FOLDER_NAMES.PROFILEIMAGE), UserControllers.updateAdmin)
     .delete(auth(USER_ROLES.SUPER_ADMIN), UserControllers.deleteAdmin);

router.patch('/admin/status/:id', auth(USER_ROLES.SUPER_ADMIN), UserControllers.updateAdminStatus);

export const UserRoutes = router;
