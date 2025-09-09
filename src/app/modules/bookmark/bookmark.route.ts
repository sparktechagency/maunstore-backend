import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../../../enums/user';
import { BookmarkControllers } from './bookmark.controller';

const router = express.Router();

router
     .route('/')
     .post(auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), BookmarkControllers.createBookmark)
     .get(auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), BookmarkControllers.getBookmarks);

router.route('/:productId').delete(auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), BookmarkControllers.deleteBookmarkById);

export const BookmarkRoutes = router;
