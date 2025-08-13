import { model, Schema } from 'mongoose';
import { TCategory } from './category.interface';

const categorySchema = new Schema<TCategory>(
     {
          name: {
               type: String,
               required: true,
          },
          description: {
               type: String,
          },
          image: {
               type: String,
               default: '',
          },
          brandId: {
               type: Schema.Types.ObjectId,
               ref: 'Brand',
          },
     },
     {
          timestamps: true,
          versionKey: false,
     },
);

export const Category = model('Category', categorySchema);
