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

export const ProductServices = {
    createProductToDB,
}

