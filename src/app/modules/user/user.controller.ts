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

const updateUser = catchAsync(async (req, res) => {
     const { id } = req.params;
     const updatedPayload = req.body;
     const result = await UserServices.updateUserToDB(id, updatedPayload);
     sendResponse(res, {
          success: true,
          statusCode: 200,
          message: 'User is updated successfully',
          data: result,
     });
});

const deleteUser = catchAsync(async (req, res) => {
     const { id } = req.params;
     const result = await UserServices.deleteUser(id);
     sendResponse(res, {
          success: true,
          statusCode: 200,
          message: 'User is deleted successfully',
          data: result,
     });
});

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
     const result = await UserServices.getUsersFromDB(req.query);
     sendResponse(res, {
          success: true,
          statusCode: 200,
          message: 'Users data are retrieved successfully',
          data: result,
     });
});

const getUserById = catchAsync(async (req, res) => {
     const { id } = req.params;
     const result = await UserServices.getUserByIdFromDB(id);
     sendResponse(res, {
          success: true,
          statusCode: 200,
          message: 'User data is retrieved successfully',
          data: result,
     });
});

const updateUserStatus = catchAsync(async (req, res) => {
     const { id } = req.params;
     const { status } = req.body;

     const result = await UserServices.updateUserStatusToDB(id, status);
     sendResponse(res, {
          success: true,
          statusCode: 200,
          message: 'User status is updated successfully',
          data: result,
     });
});

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
     console.log(id, 'ID');

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
     deleteProfile,
     getUsers,
     updateUserStatus,
     updateUser,
     deleteUser,
     getUserById,
};
