import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../../../enums/user';
import { BrandControllers } from './brand.controller';
import fileUploadHandler from '../../middleware/fileUploadHandler';
import parseFileData from '../../middleware/parseFileData';
import { FOLDER_NAMES } from '../../../enums/files';

const router = express.Router();

router.route('/').post(auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), fileUploadHandler(), parseFileData(FOLDER_NAMES.IMAGE), BrandControllers.createBrand).get(BrandControllers.getBrands);

router
     .route('/:id')
     .get(BrandControllers.getBrandById)
     .patch(auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), fileUploadHandler(), parseFileData(FOLDER_NAMES.IMAGE), BrandControllers.updateBrandById)
     .delete(auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), BrandControllers.deleteBrand);

export const BrandRoutes = router;
