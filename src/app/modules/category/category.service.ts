import { Types } from 'mongoose';
import AppError from '../../../errors/AppError';
import unlinkFile from '../../../shared/unlinkFile';
import QueryBuilder from '../../builder/QueryBuilder';
import { Product } from '../product/product.model';
import { TCategory } from './category.interface';
import { Category } from './category.model';

const createCategoryToDB = async (payload: TCategory) => {
     const result = await Category.create(payload);
     if (!result) {
          if (payload.image) {
               unlinkFile(payload.image);
          }
          throw new AppError(400, 'Failed to create category');
     }
     return result;
};

const getAllCategoriesFromDB = async (query: any) => {
     const categoryQuery = Category.find().populate('brandId');

     const queryBuilder = new QueryBuilder(categoryQuery, query).search(['name']).filter().sort().paginate().fields();

     const categories = await queryBuilder.modelQuery;

     if (!categories || categories.length === 0) {
          throw new AppError(404, 'No category are found in the database');
     }

     const meta = await queryBuilder.countTotal();

     return {
          meta,
          data: categories,
     };
};

const getCategoryByIdFromDB = async (id: string) => {
     const category = await Category.findById(id).populate('brandId');
     if (!category) {
          throw new AppError(404, 'No category is found in the database');
     }
     return category;
};

// const getCategoryByBrandsFromDB = async (brandId: string, query: any) => {
//      const result = await Category.find({ brandId }).populate({ path: 'brandId' });

//      if (!result || result.length === 0) {
//           throw new AppError(404, 'No categories are found for this brand');
//      }

//      const categoriesWithProductCount = await Promise.all(
//           result.map(async (category) => {
//                const totalProducts = await Product.countDocuments({ category: category._id });
//                return {
//                     ...category.toObject(),
//                     totalProducts,
//                };
//           }),
//      );

//      return categoriesWithProductCount;
// };

const getCategoryByBrandsFromDB = async (brandId: string, query: any) => {
     // base query with brandId
     let baseQuery = Category.find({ brandId: new Types.ObjectId(brandId) }).populate({ path: 'brandId' });

     const queryBuilder = new QueryBuilder(baseQuery, query).search(['name']).filter().sort().fields().paginate(10);

     const categories = await queryBuilder.modelQuery;

     if (!categories || categories.length === 0) {
          return [];
     }

     // totalProducts count
     const categoriesWithProductCount = await Promise.all(
          categories.map(async (category) => {
               const totalProducts = await Product.countDocuments({ category: category._id });
               return {
                    ...category.toObject(),
                    totalProducts,
               };
          }),
     );

     // get total count & pagination info
     const meta = await queryBuilder.countTotal();

     return { data: categoriesWithProductCount, meta };
};

const updateCategoryById = async (id: string, updatedPayload: Partial<TCategory>) => {
     const result = await Category.findByIdAndUpdate(id, updatedPayload, { new: true });
     if (!result) {
          throw new AppError(400, 'Failed to update category');
     }
     return result;
};

const deleteCategoryByIdFromDB = async (id: string) => {
     const result = await Category.findByIdAndDelete(id);
     if (!result) {
          throw new AppError(400, 'Failed to delete this category');
     }
     return result;
};

export const CategoryServices = {
     createCategoryToDB,
     getAllCategoriesFromDB,
     getCategoryByIdFromDB,
     getCategoryByBrandsFromDB,
     updateCategoryById,
     deleteCategoryByIdFromDB,
};
