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
exports.ReviewServices = void 0;
const review_model_1 = require("./review.model");
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const mongoose_1 = __importDefault(require("mongoose"));
const createReviewToDB = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { product, rating } = payload;
    // rating must be between 1 and 5
    if (rating < 1 || rating > 5) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Rating must be between 1 and 5');
    }
    payload.user = userId;
    // check duplicate review
    const existingReview = yield review_model_1.Review.findOne({ user: userId, product });
    if (existingReview) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, 'You have already reviewed this product.');
    }
    const result = yield review_model_1.Review.create(payload);
    return result;
});
const getReviewsByProductFromDB = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(productId)) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid product ID');
    }
    const reviews = yield review_model_1.Review.find({ product: productId }).populate({ path: 'user', select: 'name email profileImage' }).populate({ path: 'product' }).sort({ createdAt: -1 });
    if (!reviews || reviews.length === 0) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'No reviews found for this product');
    }
    return {
        totalReviews: reviews.length,
        reviews,
    };
});
const updateReviewToDB = (reviewId, userId, updatePayload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(reviewId)) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid review ID');
    }
    if (updatePayload === null || updatePayload === void 0 ? void 0 : updatePayload.product) {
        delete updatePayload.product;
    }
    if (updatePayload.rating && (updatePayload.rating < 1 || updatePayload.rating > 5)) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Rating must be between 1 and 5');
    }
    const updatedReview = yield review_model_1.Review.findOneAndUpdate({ _id: reviewId, user: userId }, updatePayload, { new: true });
    if (!updatedReview) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Review not found or not authorized');
    }
    return updatedReview;
});
const deleteReviewToDB = (reviewId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(reviewId)) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid review ID');
    }
    const deletedReview = yield review_model_1.Review.findOneAndDelete({ _id: reviewId, user: userId });
    if (!deletedReview) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Review not found or you are not authorized to delete it');
    }
    return deletedReview;
});
exports.ReviewServices = {
    createReviewToDB,
    getReviewsByProductFromDB,
    updateReviewToDB,
    deleteReviewToDB,
};
