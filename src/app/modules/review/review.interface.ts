import { Model, Types } from 'mongoose';

export type IReview = {
     user: Types.ObjectId;
     product: Types.ObjectId;
     comment: string;
     rating: number;
};

export type ReviewModel = Model<IReview>;
