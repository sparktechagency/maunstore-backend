import AppError from "../../../errors/AppError";
import unlinkFile from "../../../shared/unlinkFile";
import { TProduct } from "./product.interface";
import { Product } from "./product.model";

const createProductToDB = async (payload: TProduct) => {
    const result = await Product.create(payload);
    if (!result) {
        unlinkFile(payload.images)
    };
    return result;
}

const getProductsFromDB = async () => {
    const result = await Product.find();
    if (!result || result.length === 0) {
        throw new AppError(404, "No products are found in the database")
    };
    return result;
}



export const ProductServices = {
    createProductToDB,
    getProductsFromDB,
}

