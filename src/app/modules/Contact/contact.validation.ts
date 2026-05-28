import { z } from "zod";

const sendMessage = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    subject: z.string().optional(),
    message: z.string().min(10),
  }),
});

const messageId = z.object({
  params: z.object({ id: z.string().uuid() }),
});

const listMessages = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    read: z.enum(["true", "false"]).optional(),
  }),
});

const markRead = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({ read: z.boolean() }),
});

export const ContactValidation = {
  sendMessage,
  messageId,
  listMessages,
  markRead,
};
