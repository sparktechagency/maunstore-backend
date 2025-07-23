import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AuthServices } from './auth.service';

const verifyEmail = catchAsync(async (req, res) => {
     const { ...verifyData } = req.body;
     const result = await AuthServices.verifyEmailToDB(verifyData);

     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: result.message,
          data: result.data,
     });
});

const loginUser = catchAsync(async (req, res) => {
     const { ...loginData } = req.body;
     const result = await AuthServices.loginUserFromDB(loginData);

     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'User logged in successfully.',
          data: result,
     });
});

const forgetPassword = catchAsync(async (req, res) => {
     const email = req.body.email;
     const result = await AuthServices.forgetPasswordToDB(email);

     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Please check your email. We have sent you a one-time passcode (OTP).',
          data: result,
     });
});

// resend Otp
const resendOtp = catchAsync(async (req, res) => {
     const { email } = req.body;
     await AuthServices.resendOtpFromDb(email);

     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'OTP sent successfully again',
     });
});

const resetPassword = catchAsync(async (req, res) => {
     const token: any = req.headers.resettoken;
     const { ...resetData } = req.body;
     const result = await AuthServices.resetPasswordToDB(token!, resetData);

     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Your password has been successfully reset.',
          data: result,
     });
});

const changePassword = catchAsync(async (req, res) => {
     const user = req.user;
     const { ...passwordData } = req.body;
     await AuthServices.changePasswordToDB(user, passwordData);

     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Your password has been successfully changed',
     });
});

export const AuthControllers = {
     verifyEmail,
     loginUser,
     resendOtp,
     forgetPassword,
     resetPassword,
     changePassword,
};
