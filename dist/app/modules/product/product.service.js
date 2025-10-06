"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductServices = exports.checkIsFavorite = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const unlinkFile_1 = __importDefault(require("../../../shared/unlinkFile"));
const product_model_1 = require("./product.model");
const http_status_codes_1 = require("http-status-codes");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const bookmark_model_1 = require("../bookmark/bookmark.model");
const createProductToDB = (payload, id) => __awaiter(void 0, void 0, void 0, function* () {
    payload.createdBy = id;
    const result = yield product_model_1.Product.create(payload);
    if (!result) {
        (0, unlinkFile_1.default)(payload.images);
    }
    return result;
});
const getProductsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const productQuery = product_model_1.Product.find().populate({ path: 'category' });
    const queryBuilder = new QueryBuilder_1.default(productQuery, query).search(['name', 'modelNumber']).filter().sort().paginate().fields();
    const products = yield queryBuilder.modelQuery;
    if (!products.length) {
        throw new AppError_1.default(404, 'No products are found in the database');
    }
    const meta = yield queryBuilder.countTotal();
    return {
        meta,
        data: products,
    };
});
// const getProductByIdFromDB = async (id: string) => {
//      const result = await Product.findById(id).populate({ path: 'category' });
//      if (!result) {
//           throw new AppError(404, 'No product is found in the database');
//      }
//      return result;
// };
const checkIsFavorite = (productId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const bookmark = yield bookmark_model_1.Bookmark.findOne({
        userId: userId,
        productId: productId,
    });
    return !!bookmark;
});
exports.checkIsFavorite = checkIsFavorite;
const getProductByIdFromDB = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_model_1.Product.findById(id).populate('category');
    if (!result) {
        throw new AppError_1.default(404, 'No product is found in the database');
    }
    const isFavorite = yield (0, exports.checkIsFavorite)(result._id, userId);
    return Object.assign(Object.assign({}, result.toObject()), { isFavorite });
});
const getProductsByCategoryFromDB = (categoryId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(categoryId)) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, 'Invalid category id');
    }
    const products = yield product_model_1.Product.find({ category: categoryId }).populate('category');
    if (!products || products.length === 0) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'No products found for this category');
    }
    // map করে isFavorite যোগ করবো
    const productsWithFavorite = yield Promise.all(products.map((product) => __awaiter(void 0, void 0, void 0, function* () {
        const isFavorite = yield (0, exports.checkIsFavorite)(product._id, userId);
        return Object.assign(Object.assign({}, product.toObject()), { isFavorite });
    })));
    return {
        products: productsWithFavorite,
        totalProducts: products.length,
    };
});
const updateProductByIdToDB = (id, updatedPayload) => __awaiter(void 0, void 0, void 0, function* () {
    const isProductExist = yield product_model_1.Product.findById(id);
    if (!isProductExist) {
        throw new AppError_1.default(404, 'No product is found for this product ID');
    }
    if (updatedPayload.images && (isProductExist === null || isProductExist === void 0 ? void 0 : isProductExist.images)) {
        (0, unlinkFile_1.default)(isProductExist === null || isProductExist === void 0 ? void 0 : isProductExist.images);
    }
    const news = yield product_model_1.Product.findByIdAndUpdate(id, updatedPayload, { new: true }).populate({ path: 'category' });
    return news;
});
const deleteNewsByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, 'Invalid ');
    }
    const isProductExist = yield product_model_1.Product.findById({ _id: id });
    //delete from folder
    if (isProductExist) {
        (0, unlinkFile_1.default)(isProductExist === null || isProductExist === void 0 ? void 0 : isProductExist.images);
    }
    const result = yield product_model_1.Product.findByIdAndDelete(id);
    return result;
});
exports.ProductServices = {
    createProductToDB,
    getProductsFromDB,
    getProductsByCategoryFromDB,
    getProductByIdFromDB,
    updateProductByIdToDB,
    deleteNewsByIdFromDB,
};
