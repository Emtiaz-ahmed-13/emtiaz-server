import { Request, Response } from "express";
import { getParam } from "../../../helpers/paramsHelpers";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ProjectServices } from "./project.services";

const listProjects = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectServices.listProjects(
    req.query as Record<string, string>
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Projects retrieved successfully.",
    meta: result.meta,
    data: result.data,
  });
});

const getProjectById = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectServices.getProjectById(getParam(req.params.id));

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Project retrieved successfully.",
    data: result,
  });
});

const getProjectBySlug = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectServices.getProjectBySlug(getParam(req.params.slug));

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Project retrieved successfully.",
    data: result,
  });
});

const createProject = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectServices.createProject(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Project created successfully.",
    data: result,
  });
});

const updateProject = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectServices.updateProject(
    getParam(req.params.id),
    req.body
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Project updated successfully.",
    data: result,
  });
});

const deleteProject = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectServices.deleteProject(getParam(req.params.id));

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Project deleted successfully.",
    data: result,
  });
});

const listAllProjects = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectServices.listAllProjects(
    req.query as Record<string, string>
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All projects retrieved successfully.",
    meta: result.meta,
    data: result.data,
  });
});

export const ProjectControllers = {
  listProjects,
  listAllProjects,
  getProjectById,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
};
