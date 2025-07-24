import { IReview } from './review.interface';
import { Review } from './review.model';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../../errors/AppError';
import mongoose from 'mongoose';

const createReviewToDB = async (payload: IReview) => {
     const { user, product, rating } = payload;

     // rating must be between 1 and 5
     if (rating < 1 || rating > 5) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Rating must be between 1 and 5');
     }


     const existingReview = await Review.findOne({ user, product });

     if (existingReview) {
          throw new AppError(StatusCodes.CONFLICT, 'You have already reviewed this product.');
     }


     const result = await Review.create(payload);
     return result;
};

const getReviewsByProductFromDB = async (productId: string) => {
     if (!mongoose.Types.ObjectId.isValid(productId)) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid product ID');
     }

     const reviews = await Review.find({ product: productId })
          .populate({ path: 'user', select: 'name email profileImage' })
          .sort({ createdAt: -1 });

     if (!reviews || reviews.length === 0) {
          throw new AppError(StatusCodes.NOT_FOUND, 'No reviews found for this product');
     }

     return {
          totalReviews: reviews.length,
          reviews,
     };
};

const updateReviewToDB = async (
     reviewId: string,
     userId: string,
     updatePayload: { rating?: number; comment?: string }
) => {
     if (!mongoose.Types.ObjectId.isValid(reviewId)) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid review ID');
     }

     if (updatePayload.rating && (updatePayload.rating < 1 || updatePayload.rating > 5)) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Rating must be between 1 and 5');
     }


     const updatedReview = await Review.findOneAndUpdate(
          { _id: reviewId, user: userId },
          updatePayload,
          { new: true }
     );

     if (!updatedReview) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Review not found or not authorized');
     }

     return updatedReview;
};

const deleteReviewToDB = async (reviewId: string, userId: string) => {
     if (!mongoose.Types.ObjectId.isValid(reviewId)) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid review ID');
     }


     const deletedReview = await Review.findOneAndDelete({ _id: reviewId, user: userId });

     if (!deletedReview) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Review not found or you are not authorized to delete it');
     }

     return deletedReview;
};

export const ReviewServices = {
     createReviewToDB,
     getReviewsByProductFromDB,
     updateReviewToDB,
     deleteReviewToDB,
}