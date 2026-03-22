import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const getPasswordHash = async (
  plainTextPassword: string
): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(plainTextPassword, saltRounds);
};

export const validatePassword = async (
  plainTextPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const getJWT = async (id: string, email: string): Promise<string> => {
  return jwt.sign({ id, email }, JWT_SECRET, { expiresIn: "7d" });
};

export const validateToken = async (
  token: string
): Promise<{ id: string; email: string } | null> => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return {
      id: decoded?.id as string,
      email: decoded?.email as string,
    };
  } catch (error) {
    return null;
  }
};
