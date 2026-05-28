import express from "express";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { BlogControllers } from "./blog.controllers";
import { BlogValidation } from "./blog.validation";

const router = express.Router();

router.get(
  "/admin/all",
  auth("ADMIN"),
  validateRequest(BlogValidation.listPosts),
  BlogControllers.listAllPosts
);

router.get(
  "/",
  validateRequest(BlogValidation.listPosts),
  BlogControllers.listPosts
);

router.get(
  "/slug/:slug",
  validateRequest(BlogValidation.postSlug),
  BlogControllers.getPostBySlug
);

router.get(
  "/:id",
  validateRequest(BlogValidation.postId),
  BlogControllers.getPostById
);

router.post(
  "/",
  auth("ADMIN"),
  validateRequest(BlogValidation.createPost),
  BlogControllers.createPost
);

router.patch(
  "/:id",
  auth("ADMIN"),
  validateRequest(BlogValidation.updatePost),
  BlogControllers.updatePost
);

router.delete(
  "/:id",
  auth("ADMIN"),
  validateRequest(BlogValidation.postId),
  BlogControllers.deletePost
);

export const BlogRoutes = router;
