import { model, Schema } from 'mongoose';
import { IReview, ReviewModel } from './review.interface';

const reviewSchema = new Schema<IReview, ReviewModel>(
     {
          user: {
               type: Schema.Types.ObjectId,
               ref: 'User',
               required: true,
          },
          product: {
               type: Schema.Types.ObjectId,
               ref: 'Product',
               required: true,
          },
          comment: {
               type: String,
               required: true,
          },
          rating: {
               type: Number,
               required: true,
          },
     },
     {
          timestamps: true,
          versionKey: false,
     },
);

export const Review = model<IReview, ReviewModel>('Review', reviewSchema);
