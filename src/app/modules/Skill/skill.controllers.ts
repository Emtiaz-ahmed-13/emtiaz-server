import { Request, Response } from "express";
import { SkillCategory } from "@prisma/client";
import { getParam } from "../../../helpers/paramsHelpers";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { SkillServices } from "./skill.services";

const listSkills = catchAsync(async (req: Request, res: Response) => {
  const result = await SkillServices.listSkills(
    req.query.category as SkillCategory | undefined
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Skills retrieved successfully.",
    data: result,
  });
});

const getSkillById = catchAsync(async (req: Request, res: Response) => {
  const result = await SkillServices.getSkillById(getParam(req.params.id));

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Skill retrieved successfully.",
    data: result,
  });
});

const createSkill = catchAsync(async (req: Request, res: Response) => {
  const result = await SkillServices.createSkill(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Skill created successfully.",
    data: result,
  });
});

const updateSkill = catchAsync(async (req: Request, res: Response) => {
  const result = await SkillServices.updateSkill(getParam(req.params.id), req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Skill updated successfully.",
    data: result,
  });
});

const deleteSkill = catchAsync(async (req: Request, res: Response) => {
  const result = await SkillServices.deleteSkill(getParam(req.params.id));

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Skill deleted successfully.",
    data: result,
  });
});

export const SkillControllers = {
  listSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
};
