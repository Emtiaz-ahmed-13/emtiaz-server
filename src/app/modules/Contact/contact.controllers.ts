import { Request, Response } from "express";
import { getParam } from "../../../helpers/paramsHelpers";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ContactServices } from "./contact.services";

const sendMessage = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactServices.sendMessage(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Message sent successfully.",
    data: result,
  });
});

const listMessages = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactServices.listMessages(
    req.query as Record<string, string>
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Messages retrieved successfully.",
    meta: result.meta,
    data: result.data,
  });
});

const getMessageById = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactServices.getMessageById(getParam(req.params.id));

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Message retrieved successfully.",
    data: result,
  });
});

const markAsRead = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactServices.markAsRead(
    getParam(req.params.id),
    req.body.read
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Message updated successfully.",
    data: result,
  });
});

const deleteMessage = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactServices.deleteMessage(getParam(req.params.id));

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Message deleted successfully.",
    data: result,
  });
});

const getStats = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactServices.getStats();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Dashboard stats retrieved successfully.",
    data: result,
  });
});

export const ContactControllers = {
  sendMessage,
  listMessages,
  getMessageById,
  markAsRead,
  deleteMessage,
  getStats,
};
