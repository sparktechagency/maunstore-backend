import mongoose from 'mongoose';
import AppError from '../../../errors/AppError';
import unlinkFile from '../../../shared/unlinkFile';
import { TProduct } from './product.interface';
import { Product } from './product.model';
import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';

const createProductToDB = async (payload: TProduct) => {
     const result = await Product.create(payload);
     if (!result) {
          unlinkFile(payload.images);
     }
     return result;
};

const getProductsFromDB = async (query: any) => {
     const productQuery = Product.find().populate({ path: 'category' });

     const queryBuilder = new QueryBuilder(productQuery, query).search(['name', 'modelNumber']).filter().sort().paginate().fields();

     const products = await queryBuilder.modelQuery;

     if (!products.length) {
          throw new AppError(404, 'No products are found in the database');
     }

     const meta = await queryBuilder.countTotal();

     return {
          meta,
          data: products,
     };
};

const getProductByIdFromDB = async (id: string) => {
     const result = await Product.findById(id).populate({ path: 'category' });
     if (!result) {
          throw new AppError(404, 'No product is found in the database');
     }
     return result;
};

const getProductsByCategoryFromDB = async (categoryId: string) => {
     if (!mongoose.Types.ObjectId.isValid(categoryId)) {
          throw new AppError(StatusCodes.NOT_ACCEPTABLE, 'Invalid category id');
     }

     const products = await Product.find({ category: categoryId }).populate({ path: 'category' });

     if (!products || products.length === 0) {
          throw new AppError(StatusCodes.NOT_FOUND, 'No products found for this category');
     }

     return {
          products,
          totalProducts: products.length,
     };
};

const updateProductByIdToDB = async (id: string, updatedPayload: Partial<TProduct>) => {
     const isProductExist = await Product.findById(id);

     if (!isProductExist) {
          throw new AppError(404, 'No product is found for this product ID');
     }

     if (updatedPayload.images && isProductExist?.images) {
          unlinkFile(isProductExist?.images);
     }

     const news = await Product.findByIdAndUpdate(id, updatedPayload, { new: true }).populate({ path: 'category' });

     return news;
};

const deleteNewsByIdFromDB = async (id: string) => {
     if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new AppError(StatusCodes.NOT_ACCEPTABLE, 'Invalid ');
     }

     const isProductExist: any = await Product.findById({ _id: id });

     //delete from folder
     if (isProductExist) {
          unlinkFile(isProductExist?.images);
     }

     const result = await Product.findByIdAndDelete(id);
     return result;
};

export const ProductServices = {
     createProductToDB,
     getProductsFromDB,
     getProductsByCategoryFromDB,
     getProductByIdFromDB,
     updateProductByIdToDB,
     deleteNewsByIdFromDB,
};
