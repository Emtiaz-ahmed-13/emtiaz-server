import express from "express";
import { PortfolioControllers } from "./portfolio.controllers";

const router = express.Router();

router.get("/", PortfolioControllers.getPublicPortfolio);

export const PortfolioRoutes = router;
