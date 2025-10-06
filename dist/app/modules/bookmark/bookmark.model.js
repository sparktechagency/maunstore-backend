"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bookmark = void 0;
const mongoose_1 = require("mongoose");
const bookmarkSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    productId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Product',
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.Bookmark = (0, mongoose_1.model)('Bookmark', bookmarkSchema);
