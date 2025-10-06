"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const mongoose_1 = require("mongoose");
const categorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
        default: '',
    },
    brandId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Brand',
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.Category = (0, mongoose_1.model)('Category', categorySchema);
