import express from "express";
import auth from "../../middleware/auth";
import { USER_ROLES } from "../../../enums/user";
import { NewsControllers } from "./news.controller";
import { FOLDER_NAMES } from "../../../enums/files";
import parseFileData from "../../middleware/parseFileData";
import fileUploadHandler from "../../middleware/fileUploadHandler";

const router = express.Router();

router.route("/")
    .post(auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), fileUploadHandler(),
        parseFileData(FOLDER_NAMES.IMAGE), NewsControllers.createNews)
    .get(NewsControllers.getNews)

router.route("/:id")
    .get(NewsControllers.getNewsByd)
    .patch(auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
        fileUploadHandler(), parseFileData(FOLDER_NAMES.IMAGE),
        NewsControllers.updateNewsById)
    .delete(auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), NewsControllers.deleteNewsById)

export const NewsRoutes = router;