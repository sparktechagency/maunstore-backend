"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const user_1 = require("../../../enums/user");
const emailHelper_1 = require("../../../helpers/emailHelper");
const emailTemplate_1 = require("../../../shared/emailTemplate");
const unlinkFile_1 = __importDefault(require("../../../shared/unlinkFile"));
const user_model_1 = require("./user.model");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const generateOTP_1 = __importDefault(require("../../../utils/generateOTP"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
// create user
const createUserToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    payload.role = user_1.USER_ROLES.USER;
    const createUser = yield user_model_1.User.create(payload);
    if (!createUser) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to create business owner account');
    }
    //send email
    const otp = (0, generateOTP_1.default)();
    const values = {
        name: createUser.name,
        otp: otp,
        email: createUser.email,
    };
    const createAccountTemplate = emailTemplate_1.emailTemplate.createAccount(values);
    emailHelper_1.emailHelper.sendEmail(createAccountTemplate);
    //save to DB
    const authentication = {
        oneTimeCode: otp,
        expireAt: new Date(Date.now() + 3 * 60000),
    };
    yield user_model_1.User.findOneAndUpdate({ _id: createUser._id }, { $set: { authentication } });
    return createUser;
});
// get user profile
const getUserProfileFromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = user;
    const isExistUser = yield user_model_1.User.isExistUserById(id);
    if (!isExistUser) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    return isExistUser;
});
const getUsersFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const userQuery = user_model_1.User.find();
    const queryBuilder = new QueryBuilder_1.default(userQuery, query).search(['name', 'email']).filter().sort().paginate().fields();
    const users = yield queryBuilder.modelQuery;
    if (!users.length) {
        throw new AppError_1.default(404, 'No users are found in the database');
    }
    const meta = yield queryBuilder.countTotal();
    return {
        meta,
        data: users,
    };
});
const getUserByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(404, 'No user is found in the database');
    }
    return user;
});
const updateUserToDB = (id, updatedPayload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistUser = yield user_model_1.User.isExistUserById(id);
    if (!isExistUser) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    if (updatedPayload.profileImage) {
        (0, unlinkFile_1.default)(isExistUser === null || isExistUser === void 0 ? void 0 : isExistUser.profileImage);
    }
    const result = yield user_model_1.User.findByIdAndUpdate(id, updatedPayload, { new: true });
    if (!result) {
        throw new AppError_1.default(400, 'Failed to update user');
    }
    return result;
});
const updateUserStatusToDB = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(404, 'No user data is found for this ID');
    }
    const result = yield user_model_1.User.findByIdAndUpdate(id, { status }, { new: true });
    if (!result) {
        throw new AppError_1.default(400, 'Failed to update user status');
    }
    return result;
});
const deleteUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistUser = yield user_model_1.User.isExistUserById(id);
    if (!isExistUser) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    const result = yield user_model_1.User.findByIdAndDelete(id);
    if (!result) {
        throw new AppError_1.default(400, 'Failed to delete user');
    }
    return result;
});
// update user profile
const updateProfileToDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = user;
    const isExistUser = yield user_model_1.User.isExistUserById(id);
    if (!isExistUser) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    //unlink file here
    if (payload.profileImage) {
        (0, unlinkFile_1.default)(isExistUser.profileImage);
    }
    const result = yield user_model_1.User.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return result;
});
const verifyUserPassword = (userId, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId).select('+password');
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found.');
    }
    const isPasswordValid = yield user_model_1.User.isMatchPassword(password, user.password || '');
    return isPasswordValid;
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(id, "Id");
    const isExistUser = yield user_model_1.User.isExistUserById(id);
    if (!isExistUser) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    const result = yield user_model_1.User.findByIdAndDelete(id);
    if (!result) {
        throw new AppError_1.default(400, 'Failed to delete this user');
    }
    return result;
});
exports.UserServices = {
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
