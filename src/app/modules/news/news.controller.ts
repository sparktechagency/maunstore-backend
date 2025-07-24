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

const getNews = catchAsync(async (req, res) => {
    const result = await NewsServices.getNewsFromDB();
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "News are retrieved successfully",
        data: result,
    })
})

const getNewsByd=catchAsync(async(req ,res)=>{
    const {id}=req.params;
    const result=await NewsServices.getNewsById(id);
    sendResponse(res,{
        success:true,
        statusCode:200,
        message:"News is retrieved successfully",
        data:result,
    })
})

const updateNewsById=catchAsync(async(req ,res)=>{
    const {id}=req.params;
    const updatedPayload=req.body;
    const result=await NewsServices.updateNewsById(id,updatedPayload);
    sendResponse(res,{
        success:true,
        statusCode:200,
        message:"News is updated successfully",
        data:result,
    })
})

export const NewsControllers = {
    createNews,
    getNews,
    getNewsByd,
    updateNewsById,
}