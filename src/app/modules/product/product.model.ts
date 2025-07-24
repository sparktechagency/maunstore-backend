import { model, Schema, Types } from "mongoose";
import { TProduct } from "./product.interface";
import { GENDER } from "./product.constant";

const productSchema = new Schema<TProduct>({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
    },
    brand: {
        type: Schema.Types.ObjectId,
        ref: "Brand"
    },
    description: {
        type: String,
        required: true,
    },
    // specefication fields
    gender: {
        type: String,
        enum: Object.values(GENDER),
    },
    modelNumber: {
        type: String,
        required: true,
    },
    movement: {
        type: String,
        required: true,
    },
    caseDiameter: {
        type: String,
        required: true,
    },
    caseThickness: {
        type: String,
        required: true,
    }
},
    {
        timestamps: true,
        versionKey: false,
    }
);

export const Product = model("Product", productSchema)