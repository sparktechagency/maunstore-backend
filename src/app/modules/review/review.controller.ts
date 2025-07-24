import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ReviewServices } from './review.service';

const createReview = catchAsync(async (req, res) => {
     const { id } = req.user;
     const reviewData = req.body;
     const result = await ReviewServices.createReviewToDB(id, reviewData);
     sendResponse(res, {
          success: true,
          statusCode: 200,
          message: 'Review is created successfully',
          data: result,
     });
});

const getReviewsByProduct = catchAsync(async (req, res) => {
     const { productId } = req.params;
     const result = await ReviewServices.getReviewsByProductFromDB(productId);
     sendResponse(res, {
          success: true,
          statusCode: 200,
          message: 'Product reviews are retrieved successfully',
          data: result,
     });
});

const updateReview = catchAsync(async (req, res) => {
     const { reviewId } = req.params;
     const { id } = req.user;
     const updatedReview = req.body;
     const result = await ReviewServices.updateReviewToDB(reviewId, id, updatedReview);
     sendResponse(res, {
          success: true,
          statusCode: 200,
          message: 'Review updated successfully',
          data: result,
     });
});

const deleteReview = catchAsync(async (req, res) => {
     const { reviewId } = req.params;
     const { id } = req.user;
     const result = await ReviewServices.deleteReviewToDB(reviewId, id);
     sendResponse(res, {
          success: true,
          statusCode: 200,
          message: 'Review is deleted successfully',
          data: result,
     });
});

export const ReviewControllers = {
     createReview,
     getReviewsByProduct,
     updateReview,
     deleteReview,
};
