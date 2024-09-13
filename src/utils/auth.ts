import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../prisma";

const createAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

const createRefreshToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const createTokens = (user) => {
  return {
    accessToken: createAccessToken(user),
    refreshToken: createRefreshToken(user),
  };
};

export const refreshAccessToken = async (refreshToken) => {
  try {
    const user = jwt.verify(refreshToken, process.env.JWT_SECRET);

    let userData;
    if (user.role === "STUDENT") {
      userData = await prisma.student.findUnique({
        where: { id: user.id },
        select: { id: true, name: true, role: true },
      });
    } else {
      userData = await prisma.teacher.findUnique({
        where: { id: user.id },
        select: { id: true, name: true, role: true },
      });
    }

    return { accessToken: createAccessToken(userData) };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

export const protectedRoute = (req, res, next) => {
  const bearerToken = req.headers.authorization;

  if (!bearerToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = bearerToken.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Auth Token Required" });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).send({ message: "Invalid Token" });
  }
};
