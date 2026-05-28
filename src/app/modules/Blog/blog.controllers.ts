import { Request, Response } from "express";
import { getParam } from "../../../helpers/paramsHelpers";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { BlogServices } from "./blog.services";

const listPosts = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogServices.listPublishedPosts(
    req.query as Record<string, string>
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blog posts retrieved successfully.",
    meta: result.meta,
    data: result.data,
  });
});

const listAllPosts = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogServices.listAllPosts(
    req.query as Record<string, string>
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All blog posts retrieved successfully.",
    meta: result.meta,
    data: result.data,
  });
});

const getPostBySlug = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogServices.getPostBySlug(getParam(req.params.slug));

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blog post retrieved successfully.",
    data: result,
  });
});

const getPostById = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogServices.getPostById(getParam(req.params.id));

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blog post retrieved successfully.",
    data: result,
  });
});

const createPost = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogServices.createPost(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Blog post created successfully.",
    data: result,
  });
});

const updatePost = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogServices.updatePost(
    getParam(req.params.id),
    req.body
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blog post updated successfully.",
    data: result,
  });
});

const deletePost = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogServices.deletePost(getParam(req.params.id));

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blog post deleted successfully.",
    data: result,
  });
});

export const BlogControllers = {
  listPosts,
  listAllPosts,
  getPostBySlug,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
