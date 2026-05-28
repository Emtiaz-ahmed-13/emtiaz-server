import express from "express";
import { AuthControllers } from "./auth.controllers";
import validateRequest from "../../middleware/validateRequest";
import { AuthValidation } from "./auth.validation";
import auth from "../../middleware/auth";

const router = express.Router();

// Public registration is disabled. Only existing admins can create new admin
// accounts. The initial admin is provisioned via `prisma db seed`.
router.post(
  "/register",
  auth("ADMIN"),
  validateRequest(AuthValidation.register),
  AuthControllers.register
);
router.post(
  "/login",
  validateRequest(AuthValidation.login),
  AuthControllers.login
);
router.get("/me", auth("ADMIN"), AuthControllers.getMe);

export const AuthRoutes = router;
