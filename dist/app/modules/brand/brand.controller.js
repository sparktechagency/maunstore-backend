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
exports.BrandControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const brand_service_1 = require("./brand.service");
const createBrand = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const brandData = req.body;
    const result = yield brand_service_1.BrandServices.createBrandToDB(brandData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Brand data is created successfully',
        data: result,
    });
}));
const getBrands = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield brand_service_1.BrandServices.getBrandsFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Brands data are retrieved successfully',
        data: result,
    });
}));
const getBrandById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield brand_service_1.BrandServices.getBrandByIdFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Brand is retrieved successfully',
        data: result,
    });
}));
const updateBrandById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updatedPayload = req.body;
    const result = yield brand_service_1.BrandServices.updateBrandByIdToDB(id, updatedPayload);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Brand data is updated successfully',
        data: result,
    });
}));
const deleteBrand = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield brand_service_1.BrandServices.deleteBrandToDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Brand data is deleted successfully',
        data: result,
    });
}));
exports.BrandControllers = {
    createBrand,
    getBrands,
    getBrandById,
    updateBrandById,
    deleteBrand,
};
