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
exports.NewsServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const unlinkFile_1 = __importDefault(require("../../../shared/unlinkFile"));
const news_model_1 = require("./news.model");
const http_status_codes_1 = require("http-status-codes");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const createNewsToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield news_model_1.News.create(payload);
    if (!result) {
        (0, unlinkFile_1.default)(payload.image);
        throw new AppError_1.default(400, 'Failed to create news');
    }
    return result;
});
const getNewsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const newsQuery = news_model_1.News.find();
    const queryBuilder = new QueryBuilder_1.default(newsQuery, query).search(['title']).filter().sort().paginate().fields();
    const news = yield queryBuilder.modelQuery;
    if (!news.length) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'No news are found in the database');
    }
    const meta = yield queryBuilder.countTotal();
    return {
        meta,
        data: news,
    };
});
const getNewsByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield news_model_1.News.findById(id);
    if (!result) {
        throw new AppError_1.default(404, 'No news is found for this ID');
    }
    return result;
});
const updateNewsByIdToDB = (id, updatedPayload) => __awaiter(void 0, void 0, void 0, function* () {
    const isBannerExist = yield news_model_1.News.findById(id);
    if (updatedPayload.image && (isBannerExist === null || isBannerExist === void 0 ? void 0 : isBannerExist.image)) {
        (0, unlinkFile_1.default)(isBannerExist === null || isBannerExist === void 0 ? void 0 : isBannerExist.image);
    }
    const news = yield news_model_1.News.findByIdAndUpdate(id, updatedPayload, { new: true });
    return news;
});
const deleteNewsByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, 'Invalid ');
    }
    const isNewsExist = yield news_model_1.News.findById({ _id: id });
    //delete from folder
    if (isNewsExist) {
        (0, unlinkFile_1.default)(isNewsExist === null || isNewsExist === void 0 ? void 0 : isNewsExist.image);
    }
    const result = yield news_model_1.News.findByIdAndDelete(id);
    return result;
});
exports.NewsServices = {
    createNewsToDB,
    getNewsFromDB,
    getNewsByIdFromDB,
    updateNewsByIdToDB,
    deleteNewsByIdFromDB,
};
