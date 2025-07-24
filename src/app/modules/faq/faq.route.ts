import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import { FaqValidation } from './faq.validation';
import validateRequest from '../../middleware/validateRequest';
import auth from '../../middleware/auth';
import { FaqControllers } from './faq.controller';
const router = express.Router();

router
     .route('/')
     .post(validateRequest(FaqValidation.createFaqZodSchema), auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), FaqControllers.createFaq)
     .get(auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), FaqControllers.getFaqs);

router.delete('/multiple-delete', auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), FaqControllers.deleteMultipleFaqs);

router.route('/:id').delete(auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), FaqControllers.deleteFaq).patch(auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), FaqControllers.updateFaq);

export const FaqRoutes = router;
