import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middleware/auth';
import fileUploadHandler from '../../middleware/fileUploadHandler';
import parseFileData from '../../middleware/parseFileData';
import { FOLDER_NAMES } from '../../../enums/files';
import { BannerControllers } from './banner.controller';

const router = express.Router();

router
     .route('/')
     .post(auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
          fileUploadHandler(),
          parseFileData(FOLDER_NAMES.BANNER),
          BannerControllers.createBanner)
     .get(BannerControllers.getBanners);

router.get(
     '/all-banners',
     auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
     BannerControllers.getAllBanners,
);

router.patch(
     '/:id/status',
     auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
     BannerControllers.updateBannerStatus,
);

router
     .route('/:id')
     .patch(auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
          fileUploadHandler(), parseFileData(FOLDER_NAMES.BANNER),
          BannerControllers.updateBanner)
     .delete(auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
          BannerControllers.deleteBanner);

export const BannerRoutes = router;
