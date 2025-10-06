"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_1 = require("../../../enums/user");
const review_controller_1 = require("./review.controller");
const router = express_1.default.Router();
router.route('/').post((0, auth_1.default)(user_1.USER_ROLES.USER), review_controller_1.ReviewControllers.createReview);
router.get('/product/:productId', review_controller_1.ReviewControllers.getReviewsByProduct);
router.route('/:reviewId').patch((0, auth_1.default)(user_1.USER_ROLES.USER), review_controller_1.ReviewControllers.updateReview).delete((0, auth_1.default)(user_1.USER_ROLES.USER), review_controller_1.ReviewControllers.deleteReview);
exports.ReviewRoutes = router;
