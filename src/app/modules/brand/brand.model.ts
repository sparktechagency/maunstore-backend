import { model, Schema } from 'mongoose';
import { TBrand } from './brand.interface';

const brandSchema = new Schema<TBrand>(
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
               required: true,
          },
     },
     {
          timestamps: true,
          versionKey: false,
     },
);

export const Brand = model('Brand', brandSchema);
