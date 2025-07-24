import { Model } from 'mongoose';

export type IBanner = {
     banner: string;
     title: string;
     description: string;
     status?: boolean;
};

export type BannerModel = Model<IBanner>;
