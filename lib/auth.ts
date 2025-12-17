import { headers } from "next/headers";
import { verifyToken } from "./jwt";

export async function requireAuth() {
  const headersList = await headers();
  const auth = headersList.get("authorization");

  if (!auth || !auth.startsWith("Bearer ")) {
    throw new Error("Unauthorized: No token provided");
  }

  const token = auth.replace("Bearer ", "");
  try {
    return verifyToken(token);
  } catch (err) {
    throw new Error("Unauthorized: Invalid token");
  }
}
