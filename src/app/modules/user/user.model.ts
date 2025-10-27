import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { model, Schema } from 'mongoose';
import config from '../../../config';
import { USER_ROLES } from '../../../enums/user';
import AppError from '../../../errors/AppError';
import { IUser, UserModel } from './user.interface';
import { USER_STATUS } from './user.constant';

const userSchema = new Schema<IUser, UserModel>(
     {
          name: {
               type: String,
               required: true,
          },
          role: {
               type: String,
               enum: Object.values(USER_ROLES),
               default: USER_ROLES.USER,
          },
          email: {
               type: String,
               required: true,
               unique: true,
               lowercase: true,
          },
          password: {
               type: String,
               required: true,
               select: 0,
               minlength: 8,
          },
          phone: {
               type: String,
          },
          address: {
               type: String,
          },
          countryCode: {
               type: String,
          },
          profileImage: {
               type: String,
               default: '',
          },
          enterprise: {
               type: String,
               required: false,
          },
          status: {
               type: String,
               enum: Object.values(USER_STATUS),
               default: USER_STATUS.ACTIVE,
          },
          verified: {
               type: Boolean,
               default: false,
          },
          authentication: {
               type: {
                    isResetPassword: {
                         type: Boolean,
                         default: false,
                    },
                    oneTimeCode: {
                         type: Number,
                         default: null,
                    },
                    expireAt: {
                         type: Date,
                         default: null,
                    },
               },
               select: false,
          },
     },
     { timestamps: true },
);

// exist user check
userSchema.statics.isExistUserById = async (id: string) => {
     const isExist = await User.findById(id);
     return isExist;
};

userSchema.statics.isExistUserByEmail = async (email: string) => {
     const isExist = await User.findOne({ email });
     return isExist;
};

// is match password
userSchema.statics.isMatchPassword = async (password: string, hashPassword: string): Promise<boolean> => {
     return await bcrypt.compare(password, hashPassword);
};

// check user
userSchema.pre('save', async function (next) {
     //check user
     const isExist = await User.findOne({ email: this.email });
     if (isExist) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Email already exist!');
     }

     // password hash
     this.password = await bcrypt.hash(this.password, Number(config.bcrypt_salt_rounds));
     next();
});

export const User = model<IUser, UserModel>('User', userSchema);
