import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { AuthServices } from "./auth.services";
import sendResponse from "../../shared/sendResponse";

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.login(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Logged in successfully.",
    data: result,
  });
});

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.register(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Registered successfully.",
    data: result,
  });
});

const getMe = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const result = await AuthServices.getMe(req.user.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile retrieved successfully.",
    data: result,
  });
});

export const AuthControllers = {
  login,
  register,
  getMe,
};
