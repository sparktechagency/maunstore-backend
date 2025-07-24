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
        throw new AppError(404, "No news found in the database")
    };
    return result;
}

export const NewsServices = {
    createNewsToDB,
    getNewsFromDB,
}