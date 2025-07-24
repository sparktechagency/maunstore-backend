import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../../../enums/user';
import { ReviewControllers } from './review.controller';

const router = express.Router();

router.route('/').post(auth(USER_ROLES.USER), ReviewControllers.createReview);

router.get('/product/:productId', ReviewControllers.getReviewsByProduct);

router.route('/:reviewId').patch(auth(USER_ROLES.USER), ReviewControllers.updateReview).delete(auth(USER_ROLES.USER), ReviewControllers.deleteReview);

export const ReviewRoutes = router;
