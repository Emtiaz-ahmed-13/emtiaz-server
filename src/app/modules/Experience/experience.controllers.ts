import { Request, Response } from "express";
import { getParam } from "../../../helpers/paramsHelpers";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ExperienceServices } from "./experience.services";

const listExperiences = catchAsync(async (req: Request, res: Response) => {
  const result = await ExperienceServices.listExperiences();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Experiences retrieved successfully.",
    data: result,
  });
});

const getExperienceById = catchAsync(async (req: Request, res: Response) => {
  const result = await ExperienceServices.getExperienceById(
    getParam(req.params.id)
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Experience retrieved successfully.",
    data: result,
  });
});

const createExperience = catchAsync(async (req: Request, res: Response) => {
  const result = await ExperienceServices.createExperience(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Experience created successfully.",
    data: result,
  });
});

const updateExperience = catchAsync(async (req: Request, res: Response) => {
  const result = await ExperienceServices.updateExperience(
    getParam(req.params.id),
    req.body
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Experience updated successfully.",
    data: result,
  });
});

const deleteExperience = catchAsync(async (req: Request, res: Response) => {
  const result = await ExperienceServices.deleteExperience(
    getParam(req.params.id)
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Experience deleted successfully.",
    data: result,
  });
});

export const ExperienceControllers = {
  listExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
};
