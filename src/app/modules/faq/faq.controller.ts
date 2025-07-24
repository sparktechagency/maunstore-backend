import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { FaqServices } from './faq.service';

const createFaq = catchAsync(async (req: Request, res: Response) => {
     const payload = req.body;
     const result = await FaqServices.createFaqToDB(payload);

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Faq Created Successfully',
          data: result,
     });
});

const getFaqs = catchAsync(async (req: Request, res: Response) => {
     const result = await FaqServices.getFaqsFromDB();

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Faq retrieved Successfully',
          data: result,
     });
});

const updateFaq = catchAsync(async (req: Request, res: Response) => {
     const id = req.params.id;
     const payload = req.body;
     const result = await FaqServices.updateFaqToDB(id, payload);

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Faq Updated Successfully',
          data: result,
     });
});

const deleteFaq = catchAsync(async (req: Request, res: Response) => {
     const id = req.params.id;
     const result = await FaqServices.deleteFaqToDB(id);

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Faq Deleted Successfully',
          data: result,
     });
});

const deleteMultipleFaqs = catchAsync(async (req, res) => {
     const { ids } = req.body;

     const result = await FaqServices.deleteMultipleFaqsFromDB(ids);
     sendResponse(res, {
          success: true,
          statusCode: 200,
          message: 'Faqs are deleted successfully',
          data: result,
     });
});

export const FaqControllers = {
     createFaq,
     updateFaq,
     deleteFaq,
     getFaqs,
     deleteMultipleFaqs,
};
