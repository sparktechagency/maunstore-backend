import { Types } from 'mongoose';
import { GENDER } from './product.constant';

export type TProduct = {
     name: string;
     price: number;
     stock?: number;
     description: string;
     images: string[];
     category: Types.ObjectId;

     // specefication fields
     gender: GENDER;
     modelNumber: string;
     movement: string;
     caseDiameter: string;
     caseThickness: string;
};
