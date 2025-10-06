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
exports.CategoryServices = void 0;
const mongoose_1 = require("mongoose");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const unlinkFile_1 = __importDefault(require("../../../shared/unlinkFile"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const product_model_1 = require("../product/product.model");
const category_model_1 = require("./category.model");
const createCategoryToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_model_1.Category.create(payload);
    if (!result) {
        if (payload.image) {
            (0, unlinkFile_1.default)(payload.image);
        }
        throw new AppError_1.default(400, 'Failed to create category');
    }
    return result;
});
const getAllCategoriesFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryQuery = category_model_1.Category.find().populate('brandId');
    const queryBuilder = new QueryBuilder_1.default(categoryQuery, query).search(['name']).filter().sort().paginate().fields();
    const categories = yield queryBuilder.modelQuery;
    if (!categories || categories.length === 0) {
        throw new AppError_1.default(404, 'No category are found in the database');
    }
    const meta = yield queryBuilder.countTotal();
    return {
        meta,
        data: categories,
    };
});
const getCategoryByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_model_1.Category.findById(id).populate('brandId');
    if (!category) {
        throw new AppError_1.default(404, 'No category is found in the database');
    }
    return category;
});
// const getCategoryByBrandsFromDB = async (brandId: string, query: any) => {
//      const result = await Category.find({ brandId }).populate({ path: 'brandId' });
//      if (!result || result.length === 0) {
//           throw new AppError(404, 'No categories are found for this brand');
//      }
//      const categoriesWithProductCount = await Promise.all(
//           result.map(async (category) => {
//                const totalProducts = await Product.countDocuments({ category: category._id });
//                return {
//                     ...category.toObject(),
//                     totalProducts,
//                };
//           }),
//      );
//      return categoriesWithProductCount;
// };
const getCategoryByBrandsFromDB = (brandId, query) => __awaiter(void 0, void 0, void 0, function* () {
    // base query with brandId
    let baseQuery = category_model_1.Category.find({ brandId: new mongoose_1.Types.ObjectId(brandId) }).populate({ path: 'brandId' });
    const queryBuilder = new QueryBuilder_1.default(baseQuery, query).search(['name']).filter().sort().fields().paginate(10);
    const categories = yield queryBuilder.modelQuery;
    if (!categories || categories.length === 0) {
        return [];
    }
    // totalProducts count
    const categoriesWithProductCount = yield Promise.all(categories.map((category) => __awaiter(void 0, void 0, void 0, function* () {
        const totalProducts = yield product_model_1.Product.countDocuments({ category: category._id });
        return Object.assign(Object.assign({}, category.toObject()), { totalProducts });
    })));
    // get total count & pagination info
    const meta = yield queryBuilder.countTotal();
    return { data: categoriesWithProductCount, meta };
});
const updateCategoryById = (id, updatedPayload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_model_1.Category.findByIdAndUpdate(id, updatedPayload, { new: true });
    if (!result) {
        throw new AppError_1.default(400, 'Failed to update category');
    }
    return result;
});
const deleteCategoryByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_model_1.Category.findByIdAndDelete(id);
    if (!result) {
        throw new AppError_1.default(400, 'Failed to delete this category');
    }
    return result;
});
exports.CategoryServices = {
    createCategoryToDB,
    getAllCategoriesFromDB,
    getCategoryByIdFromDB,
    getCategoryByBrandsFromDB,
    updateCategoryById,
    deleteCategoryByIdFromDB,
};
