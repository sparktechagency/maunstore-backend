import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../../../enums/user';
import { CategoryControllers } from './category.controller';
import fileUploadHandler from '../../middleware/fileUploadHandler';
import parseFileData from '../../middleware/parseFileData';
import { FOLDER_NAMES } from '../../../enums/files';

const router = express.Router();

router
     .route('/')
     .post(auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), fileUploadHandler(), parseFileData(FOLDER_NAMES.IMAGE), CategoryControllers.createCategory)
     .get(CategoryControllers.getAllCategories);

router
     .route('/:id')
     .get(CategoryControllers.getCategoryById)
     .patch(auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), fileUploadHandler(), parseFileData(FOLDER_NAMES.IMAGE), CategoryControllers.updateCategoryById)
     .delete(auth(USER_ROLES.ADMIN), CategoryControllers.deleteCategoryById);

router.get('/brands/:brandId', CategoryControllers.getCategoryByBrands);

export const CategoryRoutes = router;
