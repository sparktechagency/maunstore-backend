import { IReview } from './review.interface';
import { Review } from './review.model';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../../errors/AppError';

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

export const ReviewServices = {
     createReviewToDB,
}