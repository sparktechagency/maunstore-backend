import { StatusCodes } from 'http-status-codes';
import { IFaq } from './faq.interface';
import { Faq } from './faq.model';
import mongoose from 'mongoose';
import AppError from '../../../errors/AppError';

const createFaqToDB = async (payload: IFaq): Promise<IFaq> => {
     const faq = await Faq.create(payload);
     if (!faq) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to created Faq');
     }

     return faq;
};

const getFaqsFromDB = async () => {
     const faqs = await Faq.find();
     if (!faqs || faqs.length === 0) {
          throw new AppError(404, "No faqs found in the database")
     }
     return faqs;
};


const updateFaqToDB = async (id: string, payload: IFaq): Promise<IFaq> => {
     if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid ID');
     }

     const updatedFaq = await Faq.findByIdAndUpdate({ _id: id }, payload, {
          new: true,
     });
     if (!updatedFaq) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to updated Faq');
     }

     return updatedFaq;
};

const deleteFaqToDB = async (id: string) => {

     const result = await Faq.findByIdAndDelete(id);
     if (!result) {
          throw new AppError(400, "Failed to delete faqs")
     }
     return result;
};

const deleteMultipleFaqsFromDB = async (ids: string[]) => {
  console.log(ids);
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'No IDs provided for deletion');
  }

  const result = await Faq.deleteMany({ _id: { $in: ids } });

  if (!result) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to delete FAQs');
  }

  return result;
};


export const FaqServices = {
     createFaqToDB,
     updateFaqToDB,
     getFaqsFromDB,
     deleteFaqToDB,
     deleteMultipleFaqsFromDB,
};
