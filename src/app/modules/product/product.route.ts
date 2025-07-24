import express from "express";
import auth from "../../middleware/auth";
import { USER_ROLES } from "../../../enums/user";
import { ProductControllers } from "./product.controller";
import fileUploadHandler from "../../middleware/fileUploadHandler";
import parseMultipleFileData from "../../middleware/parseMultipleFiledata";
import { FOLDER_NAMES } from "../../../enums/files";

const router = express.Router();

router.route("/")
    .post(auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), fileUploadHandler(), parseMultipleFileData(FOLDER_NAMES.IMAGES), ProductControllers.createProduct)
    .get(ProductControllers.getProducts)

router.get("/:brandId/products", ProductControllers.getProductsByBrand)

router.route("/:id")
    .get(ProductControllers.getProductById)
    .patch(auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), fileUploadHandler(), parseMultipleFileData(FOLDER_NAMES.IMAGES), ProductControllers.updateProductById)
    .delete(auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), fileUploadHandler(), parseMultipleFileData(FOLDER_NAMES.IMAGES), ProductControllers.deleteProductById)

export const ProductRoutes = router;