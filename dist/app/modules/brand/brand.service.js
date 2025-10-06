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
exports.BrandServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const unlinkFile_1 = __importDefault(require("../../../shared/unlinkFile"));
const brand_model_1 = require("./brand.model");
const http_status_codes_1 = require("http-status-codes");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const category_model_1 = require("../category/category.model");
const createBrandToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield brand_model_1.Brand.create(payload);
    if (!result) {
        (0, unlinkFile_1.default)(payload.image);
        throw new AppError_1.default(400, 'Failed to create brand');
    }
    return result;
});
const getBrandsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const brandQuery = brand_model_1.Brand.find();
    const queryBuilder = new QueryBuilder_1.default(brandQuery, query);
    queryBuilder.search(['name']).filter().sort().paginate().fields();
    const brands = yield queryBuilder.modelQuery;
    if (!brands.length) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'No brands are found in the database');
    }
    const brandsWithCategoryCount = yield Promise.all(brands.map((brand) => __awaiter(void 0, void 0, void 0, function* () {
        const totalCategories = yield category_model_1.Category.countDocuments({ brandId: brand._id });
        return Object.assign(Object.assign({}, brand.toObject()), { totalCategories });
    })));
    const meta = yield queryBuilder.countTotal();
    return {
        meta,
        data: brandsWithCategoryCount,
    };
});
const getBrandByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield brand_model_1.Brand.findById(id);
    if (!result) {
        throw new AppError_1.default(404, 'No brand data is found in the database');
    }
    return result;
});
const updateBrandByIdToDB = (id, updatedPayload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, 'Invalid ');
    }
    const isBrandExist = yield brand_model_1.Brand.findById(id);
    if (updatedPayload.image && (isBrandExist === null || isBrandExist === void 0 ? void 0 : isBrandExist.image)) {
        (0, unlinkFile_1.default)(isBrandExist === null || isBrandExist === void 0 ? void 0 : isBrandExist.image);
    }
    const brand = yield brand_model_1.Brand.findOneAndUpdate({ _id: id }, updatedPayload, { new: true });
    return brand;
});
const deleteBrandToDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, 'Invalid ');
    }
    const isBrandExist = yield brand_model_1.Brand.findById({ _id: id });
    //delete from folder
    if (isBrandExist) {
        (0, unlinkFile_1.default)(isBrandExist === null || isBrandExist === void 0 ? void 0 : isBrandExist.image);
    }
    //delete from database
    const result = yield brand_model_1.Brand.findByIdAndDelete(id);
    return result;
});
exports.BrandServices = {
    createBrandToDB,
    getBrandsFromDB,
    getBrandByIdFromDB,
    updateBrandByIdToDB,
    deleteBrandToDB,
};
