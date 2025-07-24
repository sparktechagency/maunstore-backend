import { Types } from 'mongoose';

export type TReview = {
     user: Types.ObjectId;
     product: Types.ObjectId;
     comment: string;
     rating: number;
};
