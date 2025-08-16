import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../../../enums/user';
import { BookmarkControllers } from './bookmark.controller';

const router = express.Router();

router.route('/').post(auth(USER_ROLES.USER), BookmarkControllers.createBookmark).get(auth(USER_ROLES.USER), BookmarkControllers.getBookmarks);

router.route('/:productId').delete(auth(USER_ROLES.USER), BookmarkControllers.deleteBookmarkById);

export const BookmarkRoutes = router;
