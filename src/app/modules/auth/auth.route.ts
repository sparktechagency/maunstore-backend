import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import { AuthControllers } from './auth.controller';
import { AuthValidation } from './auth.validation';
import validateRequest from '../../middleware/validateRequest';
import auth from '../../middleware/auth';
const router = express.Router();

router.post('/login', validateRequest(AuthValidation.createLoginZodSchema), AuthControllers.loginUser);

router.post('/forget-password', validateRequest(AuthValidation.createForgetPasswordZodSchema), AuthControllers.forgetPassword);

router.post('/verify-email', validateRequest(AuthValidation.createVerifyEmailZodSchema), AuthControllers.verifyEmail);

router.post('/resend-otp', AuthControllers.resendOtp);

router.post('/reset-password', validateRequest(AuthValidation.createResetPasswordZodSchema), AuthControllers.resetPassword);

router.post('/change-password', auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), validateRequest(AuthValidation.createChangePasswordZodSchema), AuthControllers.changePassword);

export const AuthRoutes = router;
