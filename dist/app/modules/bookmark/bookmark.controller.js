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
exports.BookmarkControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const bookmark_service_1 = require("./bookmark.service");
const createBookmark = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId } = req.user;
    const bookmarkData = req.body;
    const result = yield bookmark_service_1.BookmarkServices.createBookmarkToDB(bookmarkData, userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Bookmark is created successfully',
        data: result,
    });
}));
const getBookmarks = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bookmark_service_1.BookmarkServices.getBookmarksFromDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Bookmarks are retrieved successfully',
        data: result,
    });
}));
const deleteBookmarkById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const result = yield bookmark_service_1.BookmarkServices.deleteBookmarkByIdFromDB(productId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Bookmark is deleted successfully',
        data: result,
    });
}));
exports.BookmarkControllers = {
    createBookmark,
    getBookmarks,
    deleteBookmarkById,
};
