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

export const CategoryServices = {
    createCategoryToDB,
}