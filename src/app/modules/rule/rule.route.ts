import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middleware/auth';
import { RuleControllers } from './rule.controller';
const router = express.Router();

//about us
router.route('/about')
    .post(auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
        RuleControllers.createAbout)
    .get(RuleControllers.getAbout);

//privacy policy
router.route('/privacy-policy')
    .post(auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
        RuleControllers.createPrivacyPolicy)
    .get(RuleControllers.getPrivacyPolicy);

//terms and conditions
router.route('/terms-and-conditions')
    .post(auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
        RuleControllers.createTermsAndCondition)
    .get(RuleControllers.getTermsAndCondition);

export const RuleRoutes = router;