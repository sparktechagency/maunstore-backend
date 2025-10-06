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
exports.BookmarkServices = void 0;
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const product_model_1 = require("../product/product.model");
const bookmark_model_1 = require("./bookmark.model");
const createBookmarkToDB = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    payload.userId = userId;
    const product = yield product_model_1.Product.findById(payload.productId);
    if (!product) {
        throw new AppError_1.default(404, 'No product is found for this ID');
    }
    // check if bookmark already exists
    const exists = yield bookmark_model_1.Bookmark.findOne({
        userId,
        productId: payload.productId,
    });
    if (exists) {
        throw new AppError_1.default(400, 'Bookmark already exists');
    }
    const result = yield bookmark_model_1.Bookmark.create(payload);
    if (!result) {
        throw new AppError_1.default(400, 'Failed to create bookmark');
    }
    return result;
});
const getBookmarksFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bookmark_model_1.Bookmark.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user',
            },
        },
        { $unwind: '$user' },
        {
            $lookup: {
                from: 'products',
                localField: 'productId',
                foreignField: '_id',
                as: 'product',
            },
        },
        { $unwind: '$product' },
        {
            $project: {
                _id: 1,
                createdAt: 1,
                user: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    profileImage: 1,
                    gender: 1,
                },
                product: {
                    _id: 1,
                    name: 1,
                    price: 1,
                    stock: 1,
                    brand: 1,
                    description: 1,
                    images: 1,
                    gender: 1,
                    modelNumber: 1,
                    movement: 1,
                    caseDiameter: 1,
                    caseThickness: 1,
                },
            },
        },
    ]);
    if (!result || result.length === 0) {
        return [];
    }
    return result;
});
const deleteBookmarkByIdFromDB = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bookmark_model_1.Bookmark.findOneAndDelete({ productId });
    if (!result) {
        throw new AppError_1.default(400, 'Failed to delete bookmark');
    }
    return result;
});
exports.BookmarkServices = {
    createBookmarkToDB,
    getBookmarksFromDB,
    deleteBookmarkByIdFromDB,
};
