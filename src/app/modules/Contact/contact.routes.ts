import express from "express";
import { rateLimit } from "express-rate-limit";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { ContactControllers } from "./contact.controllers";
import { ContactValidation } from "./contact.validation";

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: {
    success: false,
    message: "Too many contact requests. Please try again later.",
  },
});

const router = express.Router();

router.post(
  "/",
  contactLimiter,
  validateRequest(ContactValidation.sendMessage),
  ContactControllers.sendMessage
);

router.get("/stats", auth("ADMIN"), ContactControllers.getStats);
router.get(
  "/",
  auth("ADMIN"),
  validateRequest(ContactValidation.listMessages),
  ContactControllers.listMessages
);
router.get(
  "/:id",
  auth("ADMIN"),
  validateRequest(ContactValidation.messageId),
  ContactControllers.getMessageById
);
router.patch(
  "/:id/read",
  auth("ADMIN"),
  validateRequest(ContactValidation.markRead),
  ContactControllers.markAsRead
);
router.delete(
  "/:id",
  auth("ADMIN"),
  validateRequest(ContactValidation.messageId),
  ContactControllers.deleteMessage
);

export const ContactRoutes = router;
