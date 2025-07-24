import { model, Schema } from 'mongoose';
import { TNews } from './news.interface';

const newsSchema = new Schema<TNews>(
     {
          title: {
               type: String,
               required: true,
          },
          description: {
               type: String,
               required: true,
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

export const News = model('News', newsSchema);
