import express from "express";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { EducationControllers } from "./education.controllers";
import { EducationValidation } from "./education.validation";

const router = express.Router();

router.get("/", EducationControllers.listEducation);
router.get(
  "/:id",
  validateRequest(EducationValidation.educationId),
  EducationControllers.getEducationById
);

router.post(
  "/",
  auth("ADMIN"),
  validateRequest(EducationValidation.createEducation),
  EducationControllers.createEducation
);
router.patch(
  "/:id",
  auth("ADMIN"),
  validateRequest(EducationValidation.updateEducation),
  EducationControllers.updateEducation
);
router.delete(
  "/:id",
  auth("ADMIN"),
  validateRequest(EducationValidation.educationId),
  EducationControllers.deleteEducation
);

export const EducationRoutes = router;
