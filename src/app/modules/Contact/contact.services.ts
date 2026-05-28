import { Prisma } from "@prisma/client";
import { buildContactEmail, sendEmail } from "../../../helpers/mailer";
import { getPagination } from "../../../helpers/paginationHelpers";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";

type TSendMessage = {
  name: string;
  email: string;
  subject?: string;
  message: string;
};

const sendMessage = async (payload: TSendMessage) => {
  const message = await prisma.contactMessage.create({ data: payload });

  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    sendEmail({
      to: adminEmail,
      subject: `New portfolio message from ${payload.name}`,
      html: buildContactEmail(payload),
      replyTo: payload.email,
    }).catch((err) => console.error("[contact] email dispatch failed:", err));
  }

  return message;
};

const listMessages = async (query: Record<string, string | undefined>) => {
  const { page, limit, skip } = getPagination(query);

  const where: Prisma.ContactMessageWhereInput = {};
  if (query.read === "true") where.read = true;
  if (query.read === "false") where.read = false;

  const [data, total] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.contactMessage.count({ where }),
  ]);

  return { data, meta: { page, limit, total } };
};

const getMessageById = async (id: string) => {
  const message = await prisma.contactMessage.findUnique({ where: { id } });
  if (!message) throw new ApiError(404, "Message not found.");
  return message;
};

const markAsRead = async (id: string, read: boolean) => {
  await getMessageById(id);
  return prisma.contactMessage.update({
    where: { id },
    data: { read },
  });
};

const deleteMessage = async (id: string) => {
  await getMessageById(id);
  return prisma.contactMessage.delete({ where: { id } });
};

const getStats = async () => {
  const [
    projects,
    skills,
    experiences,
    education,
    messages,
    unreadMessages,
    featuredProjects,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.skill.count(),
    prisma.experience.count(),
    prisma.education.count(),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.project.count({ where: { featured: true, published: true } }),
  ]);

  return {
    projects,
    skills,
    experiences,
    education,
    messages,
    unreadMessages,
    featuredProjects,
  };
};

export const ContactServices = {
  sendMessage,
  listMessages,
  getMessageById,
  markAsRead,
  deleteMessage,
  getStats,
};
