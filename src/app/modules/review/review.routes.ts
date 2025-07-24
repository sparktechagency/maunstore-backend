import express from "express"
import auth from "../../middleware/auth";
import { USER_ROLES } from "../../../enums/user";
import { ReviewControllers } from "./review.controller";

const router = express.Router();

router.route("/")
     .post(auth(USER_ROLES.USER), ReviewControllers.createReview)

export const ReviewRoutes = router;
