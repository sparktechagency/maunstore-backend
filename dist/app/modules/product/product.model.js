"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = require("mongoose");
const product_constant_1 = require("./product.constant");
const productSchema = new mongoose_1.Schema({
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
    description: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
        required: true,
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Category',
    },
    // specefication fields
    gender: {
        type: String,
        enum: Object.values(product_constant_1.GENDER),
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
    },
    createdBy: {
        type: String,
        ref: 'User',
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.Product = (0, mongoose_1.model)('Product', productSchema);
