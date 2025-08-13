import { model, Schema } from 'mongoose';
import { TBookmark } from './bookmark.interface';

const bookmarkSchema = new Schema<TBookmark>(
     {
          userId: {
               type: Schema.Types.ObjectId,
               ref: 'User',
          },
          productId: {
               type: Schema.Types.ObjectId,
               ref: 'Product',
          },
     },
     {
          timestamps: true,
          versionKey: false,
     },
);

export const Bookmark = model('Bookmark', bookmarkSchema);
