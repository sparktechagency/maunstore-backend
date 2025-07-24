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

export const ReviewServices = {
     createReviewToDB,
     getReviewsByProductFromDB,
}