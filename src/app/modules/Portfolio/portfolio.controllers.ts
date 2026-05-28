import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { PortfolioServices } from "./portfolio.services";

const getPublicPortfolio = catchAsync(async (req: Request, res: Response) => {
  const result = await PortfolioServices.getPublicPortfolio();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Portfolio data retrieved successfully.",
    data: result,
  });
});

export const PortfolioControllers = {
  getPublicPortfolio,
};
