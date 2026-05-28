import express from "express";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { ExperienceControllers } from "./experience.controllers";
import { ExperienceValidation } from "./experience.validation";

const router = express.Router();

router.get("/", ExperienceControllers.listExperiences);
router.get(
  "/:id",
  validateRequest(ExperienceValidation.experienceId),
  ExperienceControllers.getExperienceById
);

router.post(
  "/",
  auth("ADMIN"),
  validateRequest(ExperienceValidation.createExperience),
  ExperienceControllers.createExperience
);
router.patch(
  "/:id",
  auth("ADMIN"),
  validateRequest(ExperienceValidation.updateExperience),
  ExperienceControllers.updateExperience
);
router.delete(
  "/:id",
  auth("ADMIN"),
  validateRequest(ExperienceValidation.experienceId),
  ExperienceControllers.deleteExperience
);

export const ExperienceRoutes = router;
