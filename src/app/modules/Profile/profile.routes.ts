import express from "express";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { ProfileControllers } from "./profile.controllers";
import { ProfileValidation } from "./profile.validation";

const router = express.Router();

router.get("/", ProfileControllers.getProfile);
router.patch(
  "/",
  auth("ADMIN"),
  validateRequest(ProfileValidation.updateProfile),
  ProfileControllers.updateProfile
);

export const ProfileRoutes = router;
