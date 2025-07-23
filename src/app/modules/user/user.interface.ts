import { Model } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';
import { USER_STATUS } from './user.constant';
export type IUser = {
     name: string;
     role: USER_ROLES;
     email: string;
     password?: string;
     image?: string;
     status: USER_STATUS;
     verified: boolean;
     authentication?: {
          isResetPassword: boolean;
          oneTimeCode: number;
          expireAt: Date;
     };
};

export type UserModel = {
     isExistUserById(id: string): any;
     isExistUserByEmail(email: string): any;
     isExistUserByPhone(contact: string): any;
     isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;
