import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import config from '../../../config';
import bcrypt from 'bcrypt';
import { UserServices } from './user.service';

const createUser = catchAsync(async (req, res) => {
     const { ...userData } = req.body;
     const result = await UserServices.createUserToDB(userData);

     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'User created successfully',
          data: result,
     });
});

const createAdmin = catchAsync(async (req, res) => {
     const { ...userData } = req.body;
     const result = await UserServices.createAdminToDB(userData);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Admin created successfully',
          data: result,
     });
});

const getAdmins = catchAsync(async (req, res) => {
     const result = await UserServices.getAdminsFromDB();
     sendResponse(res, {
          success: true,
          statusCode: 200,
          message: "Admins are retrieved successfully",
          data: result,
     })
})

const updateAdmin = catchAsync(async (req, res) => {
     const { id } = req.params;
     const updatedPayload = req.body;
     const result = await UserServices.updateAdminToDB(id, updatedPayload);
     sendResponse(res, {
          success: true,
          statusCode: 200,
          message: "Admin data is updated successfully",
          data: result,
     })
})

const getUserProfile = catchAsync(async (req, res) => {
     const user: any = req.user;
     const result = await UserServices.getUserProfileFromDB(user);

     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Profile data retrieved successfully',
          data: result,
     });
});

const getUsers = catchAsync(async (req, res) => {
     const result = await UserServices.getUsersFromDB();
     sendResponse(res, {
          success: true,
          statusCode: 200,
          message: "Users data are retrieved successfully",
          data: result,
     })
})

const updateUserStatus = catchAsync(async (req, res) => {
     const { id } = req.params;
     const { status } = req.body;

     const result = await UserServices.updateUserStatusToDB(id, status);
     sendResponse(res, {
          success: true,
          statusCode: 200,
          message: "User status is updated successfully",
          data: result,
     })
})
const updateAdminStatus = catchAsync(async (req, res) => {
     const { id } = req.params;
     const { status } = req.body;

     const result = await UserServices.updateAdminStatusToDB(id, status);
     sendResponse(res, {
          success: true,
          statusCode: 200,
          message: "Admin status is updated successfully",
          data: result,
     })
})

const deleteAdmin = catchAsync(async (req, res) => {
     const { id } = req.params;
     const result = await UserServices.deleteAdminFromDB(id);
     sendResponse(res, {
          success: true,
          statusCode: 200,
          message: "Admin is  deleted successfully",
          data: result,
     })
})

//update profile
const updateProfile = catchAsync(async (req, res) => {
     const user: any = req.user;
     if ('role' in req.body) {
          delete req.body.role;
     }
     // If password is provided
     if (req.body.password) {
          req.body.password = await bcrypt.hash(req.body.password, Number(config.bcrypt_salt_rounds));
     }

     const result = await UserServices.updateProfileToDB(user, req.body);

     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Profile updated successfully',
          data: result,
     });
});

//delete profile
const deleteProfile = catchAsync(async (req, res) => {
     const { id }: any = req.user;
     const { password } = req.body;
     const isUserVerified = await UserServices.verifyUserPassword(id, password);
     if (!isUserVerified) {
          return sendResponse(res, {
               success: false,
               statusCode: StatusCodes.UNAUTHORIZED,
               message: 'Incorrect password. Please try again.',
          });
     }

     const result = await UserServices.deleteUser(id);

     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Profile deleted successfully',
          data: result,
     });
});

export const UserControllers = {
     createUser,
     getUserProfile,
     updateProfile,
     createAdmin,
     deleteProfile,
     getAdmins,
     updateAdmin,
     updateAdminStatus,
     deleteAdmin,
     getUsers,
     updateUserStatus,
};
