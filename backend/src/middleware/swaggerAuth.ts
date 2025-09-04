import { Request, Response, NextFunction } from "express";
import { getKeys } from "../config/keys";

export const protectDocs = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = req.headers.authorization || "";
  if (!auth.startsWith("Basic "))
    return res
      .set("WWW-Authenticate", "Basic")
      .status(401)
      .send("Auth required");
  const [u, p] = Buffer.from(auth.replace("Basic ", ""), "base64")
    .toString("utf8")
    .split(":");
  const { serverUsername, serverPassword } = getKeys();
  if (u === serverUsername && p === serverPassword) return next();
  return res.status(401).send("Invalid credentials");
};
