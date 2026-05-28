import { Secret, SignOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "../../../config";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { findUserByEmail } from "../../../helpers/userHelpers";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";

type TLogin = {
  email: string;
  password: string;
};

type TRegister = {
  name: string;
  email: string;
  password: string;
};

const login = async (payload: TLogin) => {
  const { email, password } = payload;

  const user = await findUserByEmail(email);

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) throw new ApiError(401, "Invalid Credentials.");

  // Admin-only portal. Non-admin accounts cannot sign in.
  if (user.role !== "ADMIN") {
    throw new ApiError(403, "Access restricted to admin users.");
  }

  const { password: _, ...userWithoutPassword } = user;

  const accessToken = jwtHelpers.generateToken(
    userWithoutPassword,
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as SignOptions["expiresIn"]
  );

  const refreshToken = jwtHelpers.generateToken(
    { id: user.id, email: user.email },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as SignOptions["expiresIn"]
  );

  return {
    accessToken,
    refreshToken,
    user: userWithoutPassword,
  };
};

const register = async (payload: TRegister) => {
  const existing = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existing) throw new ApiError(409, "Email already exists.");

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  const { password: _, ...userWithoutPassword } = user;

  const accessToken = jwtHelpers.generateToken(
    userWithoutPassword,
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as SignOptions["expiresIn"]
  );

  const refreshToken = jwtHelpers.generateToken(
    { id: user.id, email: user.email },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as SignOptions["expiresIn"]
  );

  return {
    accessToken,
    refreshToken,
    user: userWithoutPassword,
  };
};

const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) throw new ApiError(404, "User Not Found");
  return user;
};

export const AuthServices = {
  login,
  register,
  getMe,
};
