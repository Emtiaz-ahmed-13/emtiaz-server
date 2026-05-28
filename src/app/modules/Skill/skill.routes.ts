import express from "express";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { SkillControllers } from "./skill.controllers";
import { SkillValidation } from "./skill.validation";

const router = express.Router();

router.get(
  "/",
  validateRequest(SkillValidation.listSkills),
  SkillControllers.listSkills
);
router.get(
  "/:id",
  validateRequest(SkillValidation.skillId),
  SkillControllers.getSkillById
);

router.post(
  "/",
  auth("ADMIN"),
  validateRequest(SkillValidation.createSkill),
  SkillControllers.createSkill
);
router.patch(
  "/:id",
  auth("ADMIN"),
  validateRequest(SkillValidation.updateSkill),
  SkillControllers.updateSkill
);
router.delete(
  "/:id",
  auth("ADMIN"),
  validateRequest(SkillValidation.skillId),
  SkillControllers.deleteSkill
);

export const SkillRoutes = router;
