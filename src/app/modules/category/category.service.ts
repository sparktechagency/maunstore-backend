import AppError from '../../../errors/AppError';
import unlinkFile from '../../../shared/unlinkFile';
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

const getAllCategoriesFromDB = async () => {
     const data = await Category.find().populate('brandId');
     if (!data || data.length === 0) {
          throw new AppError(404, 'No category are found in the database');
     }
     return data;
};

const getCategoryByIdFromDB = async (id: string) => {
     const category = await Category.findById(id).populate('brandId');
     if (!category) {
          throw new AppError(404, 'No category is found in the database');
     }
     return category;
};

const getCategoryByBrandsFromDB = async (brandId: string) => {
  const result = await Category.find({ brandId }).populate({ path: 'brandId' });

  if (!result || result.length === 0) {
    throw new AppError(404, 'No categories are found for this brand');
  }

 
  const categoriesWithProductCount = await Promise.all(
    result.map(async (category) => {
      const totalProducts = await Product.countDocuments({ category: category._id });
      return {
        ...category.toObject(),
        totalProducts,
      };
    })
  );

  return categoriesWithProductCount;
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
