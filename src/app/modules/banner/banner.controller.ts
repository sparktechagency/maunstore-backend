import { Request, Response } from 'express';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import { BannerServices } from './banner.service';

const createBanner = catchAsync(async (req, res) => {
     const bannerData = req.body;
     const result = await BannerServices.createBannerToDB(bannerData);

     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Banner created successfully',
          data: result,
     });
});

const getBanners = catchAsync(async (req, res) => {
     const result = await BannerServices.getBannersFromDB();
     sendResponse(res, {
          success: true,
          statusCode: 200,
          message: 'Banners are retrieved successfully',
          data: result,
     });
});

const getAllBanners = catchAsync(async (req, res) => {
     const result = await BannerServices.getAllBannersFromDB();
     sendResponse(res, {
          success: true,
          statusCode: 200,
          message: 'Banners are retrieved successfully',
          data: result,
     });
});

const updateBanner = catchAsync(async (req: Request, res: Response) => {
     const id = req.params.id;
     const updatesData = req.body;

     const result = await BannerServices.updateBannerToDB(id, updatesData);

     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Banner updated successfully',
          data: result,
     });
});

const updateBannerStatus = catchAsync(async (req, res) => {
     const id = req.params.id;
     const { status } = req.body;
     const result = await BannerServices.updateBannerStatusToDB(id, status);
     sendResponse(res, {
          success: true,
          statusCode: 200,
          message: 'Banner status updated successfully',
          data: result,
     });
});

const deleteBanner = catchAsync(async (req: Request, res: Response) => {
     const id = req.params.id;
     const result = await BannerServices.deleteBannerToDB(id);

     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Banner deleted successfully',
          data: result,
     });
});

export const BannerControllers = {
     createBanner,
     getAllBanners,
     getBanners,
     updateBanner,
     updateBannerStatus,
     deleteBanner,
};
