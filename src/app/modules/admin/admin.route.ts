import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middleware/validateRequest';
import { UserValidation } from '../user/user.validation';
import { UserControllers } from '../user/user.controller';
import { AdminControllers } from './admin.controller';
import parseFileData from '../../middleware/parseFileData';
import fileUploadHandler from '../../middleware/fileUploadHandler';
import { FOLDER_NAMES } from '../../../enums/files';

const router = express.Router();

router
     .route('/')
     .post(auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), validateRequest(UserValidation.createUserZodSchema), AdminControllers.createAdmin)
     .get(auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), AdminControllers.getAdmins);

router
     .route('/:id')
     .patch(auth(USER_ROLES.SUPER_ADMIN), fileUploadHandler(), parseFileData(FOLDER_NAMES.PROFILEIMAGE), AdminControllers.updateAdmin)
     .delete(auth(USER_ROLES.SUPER_ADMIN), AdminControllers.deleteAdmin);

router.patch('/status/:id', auth(USER_ROLES.SUPER_ADMIN), AdminControllers.updateAdminStatus);

export const AdminRoutes = router;
