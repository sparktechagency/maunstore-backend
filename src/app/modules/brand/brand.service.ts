import mongoose from "mongoose";
import AppError from "../../../errors/AppError";
import unlinkFile from "../../../shared/unlinkFile";
import { TBrand } from "./brand.interface";
import { Brand } from "./brand.model";
import { StatusCodes } from "http-status-codes";

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
        throw new AppError(404, "No brands data are founds in the database");
    }

    return result;
}

const getBrandByIdFromDB = async (id: string) => {
    const result = await Brand.findById(id);
    if (!result) {
        throw new AppError(404, "No brand data is found in the database")
    };
    return result;
}

const updateBrandByIdToDB = async (id: string, updatedPayload: Partial<TBrand>) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError(StatusCodes.NOT_ACCEPTABLE, 'Invalid ');
    }

    const isBrandExist: any = await Brand.findById(id);

    if (updatedPayload.image && isBrandExist?.image) {
        unlinkFile(isBrandExist?.image);
    }

    const brand: any = await Brand.findOneAndUpdate({ _id: id }, updatedPayload, { new: true });
    return brand;
}


const deleteBrandToDB = async (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError(StatusCodes.NOT_ACCEPTABLE, 'Invalid ');
    }

    const isBrandExist: any = await Brand.findById({ _id: id });

    //delete from folder
    if (isBrandExist) {
        unlinkFile(isBrandExist?.image);
    }

    //delete from database
    await Brand.findByIdAndDelete(id);
    return;
};

export const BrandServices = {
    createBrandToDB,
    getBrandsFromDB,
    getBrandByIdFromDB,
    updateBrandByIdToDB,
    deleteBrandToDB,
}