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
exports.BannerServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const banner_model_1 = require("./banner.model");
const unlinkFile_1 = __importDefault(require("../../../shared/unlinkFile"));
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const createBannerToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const createBanner = yield banner_model_1.Banner.create(payload);
    if (!createBanner) {
        (0, unlinkFile_1.default)(payload.banner);
        throw new AppError_1.default(http_status_codes_1.StatusCodes.OK, 'Failed to created banner');
    }
    return createBanner;
});
const getBannersFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield banner_model_1.Banner.find({ status: true });
    if (result.length === 0) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'No banner found in database');
    }
    return result;
});
const getAllBannersFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield banner_model_1.Banner.find();
    if (!result || result.length === 0) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'No banners found in database');
    }
    return result;
});
const updateBannerToDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, 'Invalid ');
    }
    const isBannerExist = yield banner_model_1.Banner.findById(id);
    if (payload.banner && (isBannerExist === null || isBannerExist === void 0 ? void 0 : isBannerExist.banner)) {
        (0, unlinkFile_1.default)(isBannerExist === null || isBannerExist === void 0 ? void 0 : isBannerExist.banner);
    }
    const banner = yield banner_model_1.Banner.findOneAndUpdate({ _id: id }, payload, { new: true });
    return banner;
});
const updateBannerStatusToDB = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield banner_model_1.Banner.findByIdAndUpdate({ _id: id }, { status }, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to updated banner status');
    }
    return result;
});
const deleteBannerToDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, 'Invalid ');
    }
    const isBannerExist = yield banner_model_1.Banner.findById({ _id: id });
    //delete from folder
    if (isBannerExist) {
        (0, unlinkFile_1.default)(isBannerExist === null || isBannerExist === void 0 ? void 0 : isBannerExist.banner);
    }
    //delete from database
    const result = yield banner_model_1.Banner.findByIdAndDelete(id);
    return result;
});
exports.BannerServices = {
    createBannerToDB,
    getAllBannersFromDB,
    getBannersFromDB,
    updateBannerToDB,
    updateBannerStatusToDB,
    deleteBannerToDB,
};
