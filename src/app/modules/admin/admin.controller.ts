import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AdminServices } from './admin.service';

const createAdmin = catchAsync(async (req, res) => {
     const { ...userData } = req.body;
     const result = await AdminServices.createAdminToDB(userData);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Admin created successfully',
          data: result,
     });
});

const getAdmins = catchAsync(async (req, res) => {
     const result = await AdminServices.getAdminsFromDB();
     sendResponse(res, {
          success: true,
          statusCode: 200,
          message: 'Admins are retrieved successfully',
          data: result,
     });
});

const updateAdmin = catchAsync(async (req, res) => {
     const { id } = req.params;
     const updatedPayload = req.body;
     const result = await AdminServices.updateAdminToDB(id, updatedPayload);
     sendResponse(res, {
          success: true,
          statusCode: 200,
          message: 'Admin data is updated successfully',
          data: result,
     });
});

const updateAdminStatus = catchAsync(async (req, res) => {
     const { id } = req.params;
     const { status } = req.body;

     const result = await AdminServices.updateAdminStatusToDB(id, status);
     sendResponse(res, {
          success: true,
          statusCode: 200,
          message: 'Admin status is updated successfully',
          data: result,
     });
});

const deleteAdmin = catchAsync(async (req, res) => {
     const { id } = req.params;
     const result = await AdminServices.deleteAdminFromDB(id);
     sendResponse(res, {
          success: true,
          statusCode: 200,
          message: 'Admin is  deleted successfully',
          data: result,
     });
});

export const AdminControllers = {
     createAdmin,
     getAdmins,
     updateAdmin,
     updateAdminStatus,
     deleteAdmin,
};
