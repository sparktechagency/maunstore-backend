import AppError from '../../../errors/AppError';
import { Product } from '../product/product.model';
import { TBookmark } from './bookmark.interface';
import { Bookmark } from './bookmark.model';

const createBookmarkToDB = async (payload: TBookmark, userId: any) => {
     payload.userId = userId;

     const product = await Product.findById(payload.productId);
     if (!product) {
          throw new AppError(404, 'No product is found for this ID');
     }

     // check if bookmark already exists
     const exists = await Bookmark.findOne({
          userId,
          productId: payload.productId,
     });

     if (exists) {
          throw new AppError(400, 'Bookmark already exists');
     }

     const result = await Bookmark.create(payload);
     if (!result) {
          throw new AppError(400, 'Failed to create bookmark');
     }
     return result;
};

const getBookmarksFromDB = async () => {
     const result = await Bookmark.aggregate([
          {
               $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user',
               },
          },
          { $unwind: '$user' },

          {
               $lookup: {
                    from: 'products',
                    localField: 'productId',
                    foreignField: '_id',
                    as: 'product',
               },
          },
          { $unwind: '$product' },
          {
               $project: {
                    _id: 1,
                    createdAt: 1,

                    user: {
                         _id: 1,
                         name: 1,
                         email: 1,
                         profileImage: 1,
                         gender: 1,
                    },

                    product: {
                         _id: 1,
                         name: 1,
                         price: 1,
                         stock: 1,
                         brand: 1,
                         description: 1,
                         images: 1,
                         gender: 1,
                         modelNumber: 1,
                         movement: 1,
                         caseDiameter: 1,
                         caseThickness: 1,
                    },
               },
          },
     ]);

     if (!result || result.length === 0) {
          throw new AppError(404, 'No bookmarks found for this user');
     }

     return result;
};

const deleteBookmarkByIdFromDB = async (productId: string) => {
     const result = await Bookmark.findOneAndDelete({ productId });
     if (!result) {
          throw new AppError(400, 'Failed to delete bookmark');
     }
     return result;
};

export const BookmarkServices = {
     createBookmarkToDB,
     getBookmarksFromDB,
     deleteBookmarkByIdFromDB,
};
