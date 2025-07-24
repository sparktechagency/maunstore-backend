import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ReviewServices } from "./review.service";

const createReview = catchAsync(async (req, res) => {
     const { id } = req.user;
     const reviewData = req.body;
     const result = await ReviewServices.createReviewToDB(id, reviewData);
     sendResponse(res, {
          success: true,
          statusCode: 200,
          message: "Review is created successfully",
          data: result,
     })
})

const getReviewsByProduct = catchAsync(async (req, res) => {
     const { productId } = req.params;
     const result = await ReviewServices.getReviewsByProductFromDB(productId);
     sendResponse(res, {
          success: true,
          statusCode: 200,
          message: "Product reviews are retrieved successfully",
          data: result,
     })
})



export const ReviewControllers = {
     createReview,
     getReviewsByProduct,
}