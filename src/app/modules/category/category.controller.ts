import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { CategoryServices } from "./category.service";

const createCategory = catchAsync(async (req, res) => {
    const categoryData = req.body;
    const result = await CategoryServices.createCategoryToDB(categoryData);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Category is created successfully",
        data: result,
    })
});

const getAllCategories = catchAsync(async (req, res) => {
    const result = await CategoryServices.getAllCategoriesFromDB();
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Categories are retrieved successfully",
        data: result,
    })
})

const getCategoryById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CategoryServices.getCategoryByIdFromDB(id);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Category is retrieved successfully",
        data: result,
    })
})

const getCategoryByBrands = catchAsync(async (req, res) => {
    const { brandId } = req.params;
    const result = await CategoryServices.getCategoryByBrandsFromDB(brandId);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Category are retrieved successfully by brands",
        data: result,
    })
})

const updateCategoryById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    const result = await CategoryServices.updateCategoryById(id, updatedData);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Category is updated successfully",
        data: result,
    })
})

export const CategoryControllers = {
    createCategory,
    getAllCategories,
    getCategoryById,
    getCategoryByBrands,
    updateCategoryById,
}