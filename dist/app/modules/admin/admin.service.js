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
exports.AdminServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const user_1 = require("../../../enums/user");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const user_model_1 = require("../user/user.model");
const generateOTP_1 = __importDefault(require("../../../utils/generateOTP"));
const emailTemplate_1 = require("../../../shared/emailTemplate");
const emailHelper_1 = require("../../../helpers/emailHelper");
const unlinkFile_1 = __importDefault(require("../../../shared/unlinkFile"));
// create Admin
const createAdminToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    //set role
    payload.role = user_1.USER_ROLES.ADMIN;
    const createAdmin = yield user_model_1.User.create(payload);
    if (!createAdmin) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to create admin');
    }
    //send email
    const otp = (0, generateOTP_1.default)(6);
    const values = {
        name: createAdmin.name,
        otp: otp,
        email: createAdmin.email,
    };
    const createAccountTemplate = emailTemplate_1.emailTemplate.createAccount(values);
    emailHelper_1.emailHelper.sendEmail(createAccountTemplate);
    //save to DB
    const authentication = {
        oneTimeCode: otp,
        expireAt: new Date(Date.now() + 3 * 60000),
    };
    yield user_model_1.User.findOneAndUpdate({ _id: createAdmin._id }, { $set: { authentication } });
    return createAdmin;
});
const getAdminsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.find({ role: user_1.USER_ROLES.ADMIN });
    if (!result || result.length === 0) {
        throw new AppError_1.default(404, 'No admins data are found in the database');
    }
    return result;
});
const updateAdminToDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistUser = yield user_model_1.User.isExistUserById(id);
    if (!isExistUser) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Admin doesn't exist!");
    }
    if (payload.profileImage) {
        (0, unlinkFile_1.default)(isExistUser === null || isExistUser === void 0 ? void 0 : isExistUser.profileImage);
    }
    const result = yield user_model_1.User.findByIdAndUpdate(id, payload, { new: true });
    if (!result) {
        throw new AppError_1.default(400, 'Failed to updated admin');
    }
    return result;
});
const updateAdminStatusToDB = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield user_model_1.User.findById(id);
    if (!admin) {
        throw new AppError_1.default(404, 'No admin data is found for this ID');
    }
    const result = yield user_model_1.User.findByIdAndUpdate(id, { status }, { new: true });
    if (!result) {
        throw new AppError_1.default(400, 'Failed to update admin status');
    }
    return result;
});
const deleteAdminFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield user_model_1.User.findById(id);
    if (!admin) {
        throw new AppError_1.default(404, 'No admin data is found for this ID');
    }
    const result = yield user_model_1.User.findByIdAndDelete(id);
    if (!result) {
        throw new AppError_1.default(400, 'Failed to delete admin');
    }
    return result;
});
exports.AdminServices = {
    createAdminToDB,
    getAdminsFromDB,
    updateAdminToDB,
    updateAdminStatusToDB,
    deleteAdminFromDB,
};
