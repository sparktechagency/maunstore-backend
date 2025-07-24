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

export const NewsServices = {
    createNewsToDB,
}