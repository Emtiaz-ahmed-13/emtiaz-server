import { Request, Response } from "express";
import { getParam } from "../../../helpers/paramsHelpers";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { EducationServices } from "./education.services";

const listEducation = catchAsync(async (req: Request, res: Response) => {
  const result = await EducationServices.listEducation();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Education records retrieved successfully.",
    data: result,
  });
});

const getEducationById = catchAsync(async (req: Request, res: Response) => {
  const result = await EducationServices.getEducationById(
    getParam(req.params.id)
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Education record retrieved successfully.",
    data: result,
  });
});

const createEducation = catchAsync(async (req: Request, res: Response) => {
  const result = await EducationServices.createEducation(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Education record created successfully.",
    data: result,
  });
});

const updateEducation = catchAsync(async (req: Request, res: Response) => {
  const result = await EducationServices.updateEducation(
    getParam(req.params.id),
    req.body
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Education record updated successfully.",
    data: result,
  });
});

const deleteEducation = catchAsync(async (req: Request, res: Response) => {
  const result = await EducationServices.deleteEducation(
    getParam(req.params.id)
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Education record deleted successfully.",
    data: result,
  });
});

export const EducationControllers = {
  listEducation,
  getEducationById,
  createEducation,
  updateEducation,
  deleteEducation,
};
