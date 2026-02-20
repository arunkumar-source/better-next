import type { Context, Next } from "hono";
import { auth } from "@repo/auth";

export const authMiddleware = async (c: Context, next: Next) => {
 
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session?.user) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  c.set("user", session.user.id);

  await next();
};
