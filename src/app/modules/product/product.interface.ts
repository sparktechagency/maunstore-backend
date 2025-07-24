import { Types } from 'mongoose';
import { GENDER } from './product.constant';

export type TProduct = {
     name: string;
     price: number;
     stock?: number;
     brand: Types.ObjectId;
     description: string;
     images: string[];

     // specefication fields
     gender: GENDER;
     modelNumber: string;
     movement: string;
     caseDiameter: string;
     caseThickness: string;
};
