import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ProductServices } from './product.service';

const createProduct = catchAsync(async (req, res) => {
     const productData = req.body;
     const result = await ProductServices.createProductToDB(productData);
     sendResponse(res, {
          success: true,
          statusCode: 200,
          message: 'Product is created successfully',
          data: result,
     });
});

const getProducts = catchAsync(async (req, res) => {
     const result = await ProductServices.getProductsFromDB();
     sendResponse(res, {
          success: true,
          statusCode: 200,
          message: 'Products data are retrieved successfully',
          data: result,
     });
});

const getProductsByBrand = catchAsync(async (req, res) => {
     const { brandId } = req.params;
     const result = await ProductServices.getProductsByBrandFromDB(brandId);

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Products retrieved by brand successfully',
          data: result,
     });
});

const getProductById = catchAsync(async (req, res) => {
     const { id } = req.params;
     const result = await ProductServices.getProductByIdFromDB(id);
     sendResponse(res, {
          success: true,
          statusCode: 200,
          message: 'Product data is retrieved successfully',
          data: result,
     });
});

const updateProductById = catchAsync(async (req, res) => {
     const { id } = req.params;
     const updatedPayload = req.body;
     const result = await ProductServices.updateProductByIdToDB(id, updatedPayload);
     sendResponse(res, {
          success: true,
          statusCode: 200,
          message: 'Product data is updated successfully',
          data: result,
     });
});

const deleteProductById = catchAsync(async (req, res) => {
     const { id } = req.params;
     const result = await ProductServices.deleteNewsByIdFromDB(id);
     sendResponse(res, {
          success: true,
          statusCode: 200,
          message: 'Product is deleted successfully',
          data: result,
     });
});

export const ProductControllers = {
     createProduct,
     getProducts,
     getProductsByBrand,
     getProductById,
     updateProductById,
     deleteProductById,
};
