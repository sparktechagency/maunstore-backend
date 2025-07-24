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
import { USER_STATUS } from './user.constant';
import QueryBuilder from '../../builder/QueryBuilder';

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

// get user profile
const getUserProfileFromDB = async (user: JwtPayload): Promise<Partial<IUser>> => {
     const { id } = user;
     const isExistUser = await User.isExistUserById(id);
     if (!isExistUser) {
          throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
     }

     return isExistUser;
};

const getUsersFromDB = async (query: any) => {
     const userQuery = User.find();

     const queryBuilder = new QueryBuilder(userQuery, query)
          .search(["name", "email"])
          .filter()
          .sort()
          .paginate()
          .fields()

     const users = await queryBuilder.modelQuery;

     if (!users.length) {
          throw new AppError(404, "No users are found in the database")
     };

     const meta = await queryBuilder.countTotal();

     return {
          meta,
          data: users,
     };



};

const getUserByIdFromDB = async (id: string) => {
     const user = await User.findById(id);
     if (!user) {
          throw new AppError(404, 'No user is found in the database');
     }
     return user;
};

const updateUserToDB = async (id: string, updatedPayload: Partial<IUser>) => {
     const isExistUser = await User.isExistUserById(id);
     if (!isExistUser) {
          throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
     }

     if (updatedPayload.profileImage) {
          unlinkFile(isExistUser?.profileImage);
     }
     const result = await User.findByIdAndUpdate(id, updatedPayload, { new: true });
     if (!result) {
          throw new AppError(400, 'Failed to update user');
     }
     return result;
};

const updateUserStatusToDB = async (id: string, status: USER_STATUS.ACTIVE | USER_STATUS.BLOCKED) => {
     const user = await User.findById(id);
     if (!user) {
          throw new AppError(404, 'No user data is found for this ID');
     }

     const result = await User.findByIdAndUpdate(id, { status }, { new: true });
     if (!result) {
          throw new AppError(400, 'Failed to update user status');
     }

     return result;
};


const deleteUserFromDB = async (id: string) => {
     const isExistUser = await User.isExistUserById(id);
     if (!isExistUser) {
          throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
     }
     const result = await User.findByIdAndDelete(id);
     if (!result) {
          throw new AppError(400, 'Failed to delete user');
     }
     return result;
};

// update user profile
const updateProfileToDB = async (user: JwtPayload, payload: Partial<IUser>) => {
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
     deleteUser,
     verifyUserPassword,
     getUsersFromDB,
     updateUserStatusToDB,
     updateUserToDB,
     deleteUserFromDB,
     getUserByIdFromDB,
};
