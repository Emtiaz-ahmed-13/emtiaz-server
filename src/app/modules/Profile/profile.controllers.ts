import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ProfileServices } from "./profile.services";

const getProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await ProfileServices.getProfile();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile retrieved successfully.",
    data: result,
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await ProfileServices.updateProfile(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile updated successfully.",
    data: result,
  });
});

export const ProfileControllers = {
  getProfile,
  updateProfile,
};
