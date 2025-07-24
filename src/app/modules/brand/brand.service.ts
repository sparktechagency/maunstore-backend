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

const getBrandsFromDB = async () => {
    const result = await Brand.find();
    if (!result || result.length === 0) {
        throw new AppError(404, "No brands data are founds");
    }

    return result;
}

export const BrandServices = {
    createBrandToDB,
    getBrandsFromDB,
}