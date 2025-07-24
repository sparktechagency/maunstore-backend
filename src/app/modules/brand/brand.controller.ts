import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { BrandServices } from "./brand.service";

const createBrand = catchAsync(async (req, res) => {
    const brandData = req.body;
    const result = await BrandServices.createBrandToDB(brandData);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Brand data is created successfully",
        data: result,
    })
})

const getBrands = catchAsync(async (req, res) => {
    const result = await BrandServices.getBrandsFromDB();
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Brands data are retrieved successfully",
        data: result,
    })
})

const getBrandById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await BrandServices.getBrandByIdFromDB(id);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Brand is retrieved successfully",
        data: result,
    })
})

const updateBrandById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const updatedPayload = req.body;
    const result = await BrandServices.updateBrandByIdToDB(id, updatedPayload);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Brand data is updated successfully",
        data: result,
    })
})

const deleteBrand = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await BrandServices.deleteBrandToDB(id);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Brand data is deleted successfully",
        data: result,
    })
})

export const BrandControllers = {
    createBrand,
    getBrands,
    getBrandById,
    updateBrandById,
    deleteBrand,
}