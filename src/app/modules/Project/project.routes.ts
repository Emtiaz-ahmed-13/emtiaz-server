import express from "express";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { ProjectControllers } from "./project.controllers";
import { ProjectValidation } from "./project.validation";

const router = express.Router();

router.get(
  "/admin/all",
  auth("ADMIN"),
  validateRequest(ProjectValidation.listProjects),
  ProjectControllers.listAllProjects
);
router.get(
  "/",
  validateRequest(ProjectValidation.listProjects),
  ProjectControllers.listProjects
);
router.get(
  "/slug/:slug",
  validateRequest(ProjectValidation.projectSlug),
  ProjectControllers.getProjectBySlug
);
router.get(
  "/:id",
  validateRequest(ProjectValidation.projectId),
  ProjectControllers.getProjectById
);

router.post(
  "/",
  auth("ADMIN"),
  validateRequest(ProjectValidation.createProject),
  ProjectControllers.createProject
);
router.patch(
  "/:id",
  auth("ADMIN"),
  validateRequest(ProjectValidation.updateProject),
  ProjectControllers.updateProject
);
router.delete(
  "/:id",
  auth("ADMIN"),
  validateRequest(ProjectValidation.projectId),
  ProjectControllers.deleteProject
);

export const ProjectRoutes = router;
