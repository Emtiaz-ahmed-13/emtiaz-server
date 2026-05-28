import express from "express";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { BlogRoutes } from "../modules/Blog/blog.routes";
import { ProfileRoutes } from "../modules/Profile/profile.routes";
import { ProjectRoutes } from "../modules/Project/project.routes";
import { SkillRoutes } from "../modules/Skill/skill.routes";
import { ExperienceRoutes } from "../modules/Experience/experience.routes";
import { EducationRoutes } from "../modules/Education/education.routes";
import { ContactRoutes } from "../modules/Contact/contact.routes";
import { PortfolioRoutes } from "../modules/Portfolio/portfolio.routes";

const router = express.Router();

const moduleRoutes = [
  { path: "/auth", route: AuthRoutes },
  { path: "/profile", route: ProfileRoutes },
  { path: "/projects", route: ProjectRoutes },
  { path: "/skills", route: SkillRoutes },
  { path: "/experiences", route: ExperienceRoutes },
  { path: "/education", route: EducationRoutes },
  { path: "/contact", route: ContactRoutes },
  { path: "/blog", route: BlogRoutes },
  { path: "/portfolio", route: PortfolioRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
