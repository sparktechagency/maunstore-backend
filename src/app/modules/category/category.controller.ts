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

export const CategoryControllers = {
    createCategory,
}