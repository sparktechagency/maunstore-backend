import { StatusCodes } from "http-status-codes";
import { USER_ROLES } from "../../../enums/user";
import AppError from "../../../errors/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import generateOTP from "../../../utils/generateOTP";
import { emailTemplate } from "../../../shared/emailTemplate";
import { emailHelper } from "../../../helpers/emailHelper";
import unlinkFile from "../../../shared/unlinkFile";
import { USER_STATUS } from "../user/user.constant";

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

const getAdminsFromDB = async () => {
     const result = await User.find({ role: USER_ROLES.ADMIN });
     if (!result || result.length === 0) {
          throw new AppError(404, 'No admins data are found in the database');
     }
     return result;
};

const updateAdminToDB = async (id: string, payload: Partial<IUser>) => {
     const isExistUser = await User.isExistUserById(id);
     if (!isExistUser) {
          throw new AppError(StatusCodes.BAD_REQUEST, "Admin doesn't exist!");
     }

     if (payload.profileImage) {
          unlinkFile(isExistUser?.profileImage);
     }

     const result = await User.findByIdAndUpdate(id, payload, { new: true });
     if (!result) {
          throw new AppError(400, 'Failed to updated admin');
     }
     return result;
};

const updateAdminStatusToDB = async (id: string, status: USER_STATUS.ACTIVE | USER_STATUS.BLOCKED) => {
     const admin = await User.findById(id);
     if (!admin) {
          throw new AppError(404, 'No admin data is found for this ID');
     }

     const result = await User.findByIdAndUpdate(id, { status }, { new: true });
     if (!result) {
          throw new AppError(400, 'Failed to update admin status');
     }

     return result;
};

const deleteAdminFromDB = async (id: string) => {
     const admin = await User.findById(id);
     if (!admin) {
          throw new AppError(404, 'No admin data is found for this ID');
     }
     const result = await User.findByIdAndDelete(id);
     if (!result) {
          throw new AppError(400, 'Failed to delete admin');
     }
     return result;
};

export const AdminServices = {
     createAdminToDB,
     getAdminsFromDB,
     updateAdminToDB,
     updateAdminStatusToDB,
     deleteAdminFromDB,
}