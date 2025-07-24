import { model, Schema } from 'mongoose';
import { TReview } from './review.interface';

const reviewSchema = new Schema<TReview>(
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

export const Review = model<TReview>('Review', reviewSchema);
