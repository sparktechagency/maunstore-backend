import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLES } from '../../../enums/user';
import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import unlinkFile from '../../../shared/unlinkFile';
import { IUser } from './user.interface';
import { User } from './user.model';
import AppError from '../../../errors/AppError';
import generateOTP from '../../../utils/generateOTP';

// create user
const createUserToDB = async (payload: Partial<IUser>): Promise<IUser> => {
     payload.role = USER_ROLES.USER;
     const createUser = await User.create(payload);
     if (!createUser) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create business owner account');
     }

     //send email
     const otp = generateOTP();
     const values = {
          name: createUser.name,
          otp: otp,
          email: createUser.email!,
     };
     const createAccountTemplate = emailTemplate.createAccount(values);
     emailHelper.sendEmail(createAccountTemplate);

     //save to DB
     const authentication = {
          oneTimeCode: otp,
          expireAt: new Date(Date.now() + 3 * 60000),
     };
     await User.findOneAndUpdate({ _id: createUser._id }, { $set: { authentication } });

     return createUser;
};

// create Admin
const createAdminToDB = async (payload: Partial<IUser>): Promise<IUser> => {
     //set role
     payload.role = USER_ROLES.ADMIN;
     const createAdmin = await User.create(payload);
     if (!createAdmin) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create admin');
     }

     //send email
     const otp = generateOTP(6);
     const values = {
          name: createAdmin.name,
          otp: otp,
          email: createAdmin.email!,
     };
     const createAccountTemplate = emailTemplate.createAccount(values);
     emailHelper.sendEmail(createAccountTemplate);

     //save to DB
     const authentication = {
          oneTimeCode: otp,
          expireAt: new Date(Date.now() + 3 * 60000),
     };
     await User.findOneAndUpdate({ _id: createAdmin._id }, { $set: { authentication } });

     return createAdmin;
};

// get user profile
const getUserProfileFromDB = async (user: JwtPayload): Promise<Partial<IUser>> => {
     const { id } = user;
     const isExistUser = await User.isExistUserById(id);
     if (!isExistUser) {
          throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
     }

     return isExistUser;
};

// update user profile
const updateProfileToDB = async (user: JwtPayload, payload: Partial<IUser>): Promise<Partial<IUser | null>> => {
     const { id } = user;
     const isExistUser = await User.isExistUserById(id);
     if (!isExistUser) {
          throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
     }

     //unlink file here
     if (payload.profileImage) {
          unlinkFile(isExistUser.profileImage);
     }

     const result = await User.findOneAndUpdate({ _id: id }, payload, {
          new: true,
     });

     return result;
};

const verifyUserPassword = async (userId: string, password: string) => {
     const user = await User.findById(userId).select('+password');
     if (!user) {
          throw new AppError(StatusCodes.NOT_FOUND, 'User not found.');
     }
     const isPasswordValid = await User.isMatchPassword(password, user.password || '');
     return isPasswordValid;
};

const deleteUser = async (id: string) => {
     const isExistUser = await User.isExistUserById(id);
     if (!isExistUser) {
          throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
     }

     const result = await User.findByIdAndDelete(id);

     if (!result) {
          throw new AppError(400, 'Failed to delete this user');
     }
     return result;
};

export const UserServices = {
     createUserToDB,
     getUserProfileFromDB,
     updateProfileToDB,
     createAdminToDB,
     deleteUser,
     verifyUserPassword,
};
