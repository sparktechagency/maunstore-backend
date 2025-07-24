import AppError from "../../../errors/AppError";
import unlinkFile from "../../../shared/unlinkFile";
import { TNews } from "./news.interface";
import { News } from "./news.model";

const createNewsToDB = async (payload: TNews) => {
    const result = await News.create(payload);
    if (!result) {
        unlinkFile(payload.image)
        throw new AppError(400, "Failed to create news")
    };
    return result;
}

const getNewsFromDB = async () => {
    const result = await News.find();
    if (!result || result.length === 0) {
        throw new AppError(404, "No news are found in the database")
    };
    return result;
}

const getNewsById = async (id: string) => {
    const result = await News.findById(id);
    if (!result) {
        throw new AppError(404, "No news is found for this ID")
    };
    return result;
}

const updateNewsById = async (id: string, updatedPayload: Partial<TNews>) => {
    const isBannerExist: any = await News.findById(id);

    if (updatedPayload.image && isBannerExist?.image) {
        unlinkFile(isBannerExist?.image);
    }

    const news = await News.findByIdAndUpdate(id, updatedPayload);

    return news;
}

export const NewsServices = {
    createNewsToDB,
    getNewsFromDB,
    getNewsById,
    updateNewsById,
}