import AppError from "../../../errors/AppError";
import unlinkFile from "../../../shared/unlinkFile";
import { TBrand } from "./brand.interface";
import { Brand } from "./brand.model";

const createBrandToDB = async (payload: TBrand) => {
    const result = await Brand.create(payload);
    if (!result) {
        unlinkFile(payload.image);
        throw new AppError(400, "Failed to create brand")
    };
    return result;
}

export const BrandServices = {
    createBrandToDB,
}