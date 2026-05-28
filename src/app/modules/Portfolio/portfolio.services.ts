import ApiError from "../../errors/ApiError";
import { withResolvedCoverUrls } from "../../../helpers/imageUrlHelpers";
import prisma from "../../shared/prisma";

const getPublicPortfolio = async () => {
  const [
    profile,
    projects,
    skills,
    experiences,
    education,
    achievements,
    posts,
  ] = await Promise.all([
    prisma.profile.findFirst(),
    prisma.project.findMany({
      where: { published: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    }),
    prisma.skill.findMany({
      orderBy: [{ order: "asc" }, { name: "asc" }],
    }),
    prisma.experience.findMany({
      orderBy: [{ order: "asc" }, { startDate: "desc" }],
    }),
    prisma.education.findMany({
      orderBy: [{ order: "asc" }, { startDate: "desc" }],
    }),
    prisma.achievement.findMany({
      where: { published: true },
      orderBy: [{ date: "desc" }, { order: "asc" }],
    }),
    prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { order: "asc" }],
      take: 6,
    }),
  ]);

  if (!profile) throw new ApiError(404, "Portfolio profile not found.");

  return {
    profile,
    projects,
    skills,
    experiences,
    education,
    achievements,
    posts: await withResolvedCoverUrls(posts),
  };
};

export const PortfolioServices = {
  getPublicPortfolio,
};
