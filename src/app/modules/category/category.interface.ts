import { Types } from "mongoose";

export type TCategory = {
    name: string;
    description?: string;
    image?: string;
    brandId: Types.ObjectId;
}