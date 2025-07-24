import { model, Schema } from 'mongoose';
import { BannerModel, IBanner } from './banner.interface';

const bannerSchema = new Schema<IBanner, BannerModel>(
     {
          banner: {
               type: String,
               required: true,
          },
          title: {
               type: String,
               required: true,
          },
          description: {
               type: String,
               required: true,
          },
          status: {
               type: Boolean,
          },
     },
     {
          timestamps: true,
          versionKey: false,
     },
);

export const Banner = model<IBanner, BannerModel>('Banner', bannerSchema);
