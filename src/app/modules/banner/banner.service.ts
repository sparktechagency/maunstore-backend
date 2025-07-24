import { StatusCodes } from 'http-status-codes';
import { IBanner } from './banner.interface';
import { Banner } from './banner.model';
import unlinkFile from '../../../shared/unlinkFile';
import mongoose from 'mongoose';
import AppError from '../../../errors/AppError';

const createBannerToDB = async (payload: IBanner) => {
     const createBanner: any = await Banner.create(payload);
     if (!createBanner) {
          unlinkFile(payload.banner);
          throw new AppError(StatusCodes.OK, 'Failed to created banner');
     }

     return createBanner;
};

const getBannersFromDB = async () => {
     const result = await Banner.find({ status: true });
     if (result.length === 0) {
          throw new AppError(StatusCodes.NOT_FOUND, 'No banner found in database');
     }
     return result;
};

const getAllBannersFromDB = async () => {
     const result = await Banner.find();
     if (!result || result.length === 0) {
          throw new AppError(StatusCodes.NOT_FOUND, 'No banners found in database');
     }
     return result;
};

const updateBannerToDB = async (id: string, payload: IBanner) => {
     if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new AppError(StatusCodes.NOT_ACCEPTABLE, 'Invalid ');
     }

     const isBannerExist: any = await Banner.findById(id);

     if (payload.banner && isBannerExist?.banner) {
          unlinkFile(isBannerExist?.banner);
     }

     const banner: any = await Banner.findOneAndUpdate({ _id: id }, payload, { new: true });
     return banner;
};

const updateBannerStatusToDB = async (id: string, status: string) => {
     const result = await Banner.findByIdAndUpdate({ _id: id }, { status }, { new: true });
     if (!result) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to updated banner status');
     }
     return result;
};

const deleteBannerToDB = async (id: string) => {
     if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new AppError(StatusCodes.NOT_ACCEPTABLE, 'Invalid ');
     }

     const isBannerExist: any = await Banner.findById({ _id: id });

     //delete from folder
     if (isBannerExist) {
          unlinkFile(isBannerExist?.banner);
     }

     //delete from database
     const result = await Banner.findByIdAndDelete(id);
     return result;
};

export const BannerServices = {
     createBannerToDB,
     getAllBannersFromDB,
     getBannersFromDB,
     updateBannerToDB,
     updateBannerStatusToDB,
     deleteBannerToDB,
};
