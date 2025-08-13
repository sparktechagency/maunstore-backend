import mongoose from 'mongoose';
import AppError from '../../../errors/AppError';
import unlinkFile from '../../../shared/unlinkFile';
import { TBrand } from './brand.interface';
import { Brand } from './brand.model';
import { StatusCodes } from 'http-status-codes';
import { Product } from '../product/product.model';
import QueryBuilder from '../../builder/QueryBuilder';

const createBrandToDB = async (payload: TBrand) => {
     const result = await Brand.create(payload);
     if (!result) {
          unlinkFile(payload.image);
          throw new AppError(400, 'Failed to create brand');
     }
     return result;
};


const getBrandsFromDB = async (query: any) => {
     const brandQuery = Brand.find();
     const queryBuilder = new QueryBuilder(brandQuery, query);

     queryBuilder.search(['name']).filter().sort().paginate().fields();

     const brands = await queryBuilder.modelQuery;

     if (!brands.length) {
          throw new AppError(StatusCodes.NOT_FOUND, 'No brands are found in the database');
     }

     const brandsWithProductCount = await Promise.all(
          brands.map(async (brand) => {
               const totalProducts = await Product.countDocuments({ brand: brand._id });
               return {
                    ...brand.toObject(),
                    totalProducts,
               };
          }),
     );

     const meta = await queryBuilder.countTotal();

     return {
          meta,
          data: brandsWithProductCount,
     };
};

const getBrandByIdFromDB = async (id: string) => {
     const result = await Brand.findById(id);
     if (!result) {
          throw new AppError(404, 'No brand data is found in the database');
     }
     return result;
};

const updateBrandByIdToDB = async (id: string, updatedPayload: Partial<TBrand>) => {
     if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new AppError(StatusCodes.NOT_ACCEPTABLE, 'Invalid ');
     }

     const isBrandExist: any = await Brand.findById(id);

     if (updatedPayload.image && isBrandExist?.image) {
          unlinkFile(isBrandExist?.image);
     }

     const brand: any = await Brand.findOneAndUpdate({ _id: id }, updatedPayload, { new: true });
     return brand;
};

const deleteBrandToDB = async (id: string) => {
     if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new AppError(StatusCodes.NOT_ACCEPTABLE, 'Invalid ');
     }

     const isBrandExist: any = await Brand.findById({ _id: id });

     //delete from folder
     if (isBrandExist) {
          unlinkFile(isBrandExist?.image);
     }

     //delete from database
     const result = await Brand.findByIdAndDelete(id);
     return result;
};

export const BrandServices = {
     createBrandToDB,
     getBrandsFromDB,
     getBrandByIdFromDB,
     updateBrandByIdToDB,
     deleteBrandToDB,
};
