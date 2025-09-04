import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getKeys } from "../config/keys";

export type UserRole = "admin" | "supervisor" | "nurse";
export interface JwtUser {
  id: string;
  role: UserRole;
}

export const requireAuth =
  (roles?: UserRole[]) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const hdr = req.headers.authorization || "";
      const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : "";
      if (!token)
        return res
          .status(401)
          .json({ statusCode: 401, message: "Unauthenticated", data: null });
      const decoded = jwt.verify(token, getKeys().secretKey) as JwtUser;
      (req as any).user = decoded;
      if (roles && !roles.includes(decoded.role))
        return res
          .status(403)
          .json({ statusCode: 403, message: "Unauthorized", data: null });
      next();
    } catch {
      return res
        .status(401)
        .json({ statusCode: 401, message: "Unauthenticated", data: null });
    }
  };
