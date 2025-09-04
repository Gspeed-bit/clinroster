import { AnyZodObject, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "../utils/apiError";

export const validateBody =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (e) {
      const z = e as ZodError;
      return res.status(StatusCodes.INVALID_INPUT).json({
        statusCode: StatusCodes.INVALID_INPUT,
        message: "Input Validation Error",
        data: z.flatten(),
      });
    }
  };

export const validateQuery =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (e) {
      const z = e as ZodError;
      return res.status(StatusCodes.INVALID_INPUT).json({
        statusCode: StatusCodes.INVALID_INPUT,
        message: "Input Validation Error",
        data: z.flatten(),
      });
    }
  };
