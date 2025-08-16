import mongoose, { Types } from 'mongoose';
import AppError from '../../../errors/AppError';
import unlinkFile from '../../../shared/unlinkFile';
import { TProduct } from './product.interface';
import { Product } from './product.model';
import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';
import { Bookmark } from '../bookmark/bookmark.model';

const createProductToDB = async (payload: TProduct, id: any) => {
     payload.createdBy = id;
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

// const getProductByIdFromDB = async (id: string) => {
//      const result = await Product.findById(id).populate({ path: 'category' });
//      if (!result) {
//           throw new AppError(404, 'No product is found in the database');
//      }
//      return result;
// };

export const checkIsFavorite = async (productId: string | Types.ObjectId, userId: string | Types.ObjectId) => {
     const bookmark = await Bookmark.findOne({
          userId: userId,
          productId: productId,
     });

     return !!bookmark;
};

const getProductByIdFromDB = async (id: string, userId: string) => {
     const result = await Product.findById(id).populate('category');

     if (!result) {
          throw new AppError(404, 'No product is found in the database');
     }

     const isFavorite = await checkIsFavorite(result._id, userId);

     return {
          ...result.toObject(),
          isFavorite,
     };
};

const getProductsByCategoryFromDB = async (categoryId: string, userId: string) => {
     if (!mongoose.Types.ObjectId.isValid(categoryId)) {
          throw new AppError(StatusCodes.NOT_ACCEPTABLE, 'Invalid category id');
     }

     const products = await Product.find({ category: categoryId }).populate('category');

     if (!products || products.length === 0) {
          throw new AppError(StatusCodes.NOT_FOUND, 'No products found for this category');
     }

     // map করে isFavorite যোগ করবো
     const productsWithFavorite = await Promise.all(
          products.map(async (product) => {
               const isFavorite = await checkIsFavorite(product._id, userId);
               return {
                    ...product.toObject(),
                    isFavorite,
               };
          }),
     );

     return {
          products: productsWithFavorite,
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
