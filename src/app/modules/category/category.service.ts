import AppError from "../../../errors/AppError";
import unlinkFile from "../../../shared/unlinkFile";
import { TCategory } from "./category.interface"
import { Category } from "./category.model"

const createCategoryToDB = async (payload: TCategory) => {
    const result = await Category.create(payload);
    if (!result) {
        if (payload.image) {
            unlinkFile(payload.image)
        };
        throw new AppError(400, "Failed to create category")
    }
};

const getAllCategoriesFromDB = async () => {
    const data = await Category.find();
    if (!data || data.length === 0) {
        throw new AppError(404, "No category are found in the database")
    };
    return data;
}

const getCategoryByIdFromDB = async (id: string) => {
    const category = await Category.findById(id);
    if (!category) {
        throw new AppError(404, "No category is found in the database")
    };
    return category;
}

const getCategoryByBrandsFromDB = async (brandId: string) => {
    const result = await Category.find({ brandId });
    if (!result || result.length === 0) {
        throw new AppError(404, "No category are founds for this brand");
    };
    return result;
}

export const CategoryServices = {
    createCategoryToDB,
    getAllCategoriesFromDB,
    getCategoryByIdFromDB,
    getCategoryByBrandsFromDB,
}