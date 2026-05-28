import express from "express";
import { AuthControllers } from "./auth.controllers";
import validateRequest from "../../middleware/validateRequest";
import { AuthValidation } from "./auth.validation";
import auth from "../../middleware/auth";

const router = express.Router();

router.post(
  "/register",
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
