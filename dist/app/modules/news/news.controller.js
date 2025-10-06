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
exports.NewsControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const news_service_1 = require("./news.service");
const createNews = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newsData = req.body;
    const result = yield news_service_1.NewsServices.createNewsToDB(newsData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'News data is created successfully',
        data: result,
    });
}));
const getNews = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield news_service_1.NewsServices.getNewsFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'News are retrieved successfully',
        data: result,
    });
}));
const getNewsByd = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield news_service_1.NewsServices.getNewsByIdFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'News is retrieved successfully',
        data: result,
    });
}));
const updateNewsById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updatedPayload = req.body;
    const result = yield news_service_1.NewsServices.updateNewsByIdToDB(id, updatedPayload);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'News is updated successfully',
        data: result,
    });
}));
const deleteNewsById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield news_service_1.NewsServices.deleteNewsByIdFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'News is deleted successfully',
        data: result,
    });
}));
exports.NewsControllers = {
    createNews,
    getNews,
    getNewsByd,
    updateNewsById,
    deleteNewsById,
};
