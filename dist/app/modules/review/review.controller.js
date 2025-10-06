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
exports.ReviewControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const review_service_1 = require("./review.service");
const createReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const reviewData = req.body;
    const result = yield review_service_1.ReviewServices.createReviewToDB(id, reviewData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Review is created successfully',
        data: result,
    });
}));
const getReviewsByProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const result = yield review_service_1.ReviewServices.getReviewsByProductFromDB(productId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Product reviews are retrieved successfully',
        data: result,
    });
}));
const updateReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewId } = req.params;
    const { id } = req.user;
    const updatedReview = req.body;
    const result = yield review_service_1.ReviewServices.updateReviewToDB(reviewId, id, updatedReview);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Review updated successfully',
        data: result,
    });
}));
const deleteReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewId } = req.params;
    const { id } = req.user;
    const result = yield review_service_1.ReviewServices.deleteReviewToDB(reviewId, id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Review is deleted successfully',
        data: result,
    });
}));
exports.ReviewControllers = {
    createReview,
    getReviewsByProduct,
    updateReview,
    deleteReview,
};
