import { Types } from 'mongoose';

export type TBookmark = {
     userId: Types.ObjectId;
     productId: Types.ObjectId;
};
