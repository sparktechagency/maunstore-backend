import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { NewsServices } from "./news.service";

const createNews = catchAsync(async (req, res) => {
    const newsData = req.body;
    const result = await NewsServices.createNewsToDB(newsData);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "News data is created successfully",
        data: result,
    })
})

export const NewsControllers = {
    createNews,
}