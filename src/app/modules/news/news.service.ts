import mongoose from 'mongoose';
import AppError from '../../../errors/AppError';
import unlinkFile from '../../../shared/unlinkFile';
import { TNews } from './news.interface';
import { News } from './news.model';
import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';

const createNewsToDB = async (payload: TNews) => {
     const result = await News.create(payload);
     if (!result) {
          unlinkFile(payload.image);
          throw new AppError(400, 'Failed to create news');
     }
     return result;
};

const getNewsFromDB = async (query: any) => {
     const newsQuery = News.find();

     const queryBuilder = new QueryBuilder(newsQuery, query).search(['title']).filter().sort().paginate().fields();

     const news = await queryBuilder.modelQuery;

     if (!news.length) {
          throw new AppError(StatusCodes.NOT_FOUND, 'No news are found in the database');
     }

     const meta = await queryBuilder.countTotal();

     return {
          meta,
          data: news,
     };
};

const getNewsByIdFromDB = async (id: string) => {
     const result = await News.findById(id);
     if (!result) {
          throw new AppError(404, 'No news is found for this ID');
     }
     return result;
};

const updateNewsByIdToDB = async (id: string, updatedPayload: Partial<TNews>) => {
     const isBannerExist: any = await News.findById(id);

     if (updatedPayload.image && isBannerExist?.image) {
          unlinkFile(isBannerExist?.image);
     }

     const news = await News.findByIdAndUpdate(id, updatedPayload, { new: true });

     return news;
};

const deleteNewsByIdFromDB = async (id: string) => {
     if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new AppError(StatusCodes.NOT_ACCEPTABLE, 'Invalid ');
     }

     const isNewsExist: any = await News.findById({ _id: id });

     // delete from folder
     if (isNewsExist) {
          unlinkFile(isNewsExist?.image);
     }

     const result = await News.findByIdAndDelete(id);
     return result;
};

export const NewsServices = {
     createNewsToDB,
     getNewsFromDB,
     getNewsByIdFromDB,
     updateNewsByIdToDB,
     deleteNewsByIdFromDB,
};
