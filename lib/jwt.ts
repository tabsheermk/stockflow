import jwt, { Secret, SignOptions } from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET as Secret;
const EXPIRES_IN = (process.env.JWT_EXPIRES_IN ||
  "7d") as SignOptions["expiresIn"];

if (!SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export function signToken(payload: object) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

export function verifyToken(token: string) {
  return jwt.verify(token, SECRET) as { userId: string; orgId: string };
}
