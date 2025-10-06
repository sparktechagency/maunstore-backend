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
const http_status_codes_1 = require("http-status-codes");
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const verifyToken_1 = require("../../utils/verifyToken");
const user_model_1 = require("../modules/user/user.model");
const auth = (...roles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tokenWithBearer = req.headers.authorization;
        if (!tokenWithBearer) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'You are not authorized !!');
        }
        if (!tokenWithBearer.startsWith('Bearer')) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Token send is not valid !!');
        }
        if (tokenWithBearer && tokenWithBearer.startsWith('Bearer')) {
            const token = tokenWithBearer.split(' ')[1];
            //verify token
            let verifyUser;
            try {
                verifyUser = (0, verifyToken_1.verifyToken)(token, config_1.default.jwt.jwt_secret);
            }
            catch (error) {
                throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'You are not authorized !!');
            }
            //  user cheak isUserExist or not
            const user = yield user_model_1.User.isExistUserById(verifyUser.id);
            if (!user) {
                throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'This user is not found !!');
            }
            if ((user === null || user === void 0 ? void 0 : user.status) === 'blocked') {
                throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'This user is blocked !!');
            }
            if (user === null || user === void 0 ? void 0 : user.isDeleted) {
                throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'This user accaunt is deleted !!');
            }
            //guard user
            if (roles.length && !roles.includes(verifyUser === null || verifyUser === void 0 ? void 0 : verifyUser.role)) {
                throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "You don't have permission to access this api !!");
            }
            //set user to header
            req.user = verifyUser;
            next();
        }
    }
    catch (error) {
        next(error);
    }
});
exports.default = auth;
