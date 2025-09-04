// src/app.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { StatusCodes } from "./utils/apiError";
import { getKeys } from "./config/keys";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";
import { protectDocs } from "./middleware/swaggerAuth";
import authRoutes from "./routes/auth.routes";

export const createApp = () => {
  const app = express();
  app.use(cors());
  app.use(helmet());
  app.use(express.json());
  app.use(morgan("dev"));
  app.use("/docs", protectDocs, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use("/auth", authRoutes);

  app.get("/health", (_req, res) =>
    res.status(StatusCodes.SUCCESS).json({
      statusCode: StatusCodes.SUCCESS,
      appEnv: getKeys().appEnv,
      message: "App is running healthy 🚀",
      timestamp: new Date().toISOString(),
    })
  );
  // global error handler
  app.use(
    (
      err: any,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction
    ) => {
      const status = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
      res.status(status).json({
        statusCode: status,
        message: err.message || "Internal Server Error",
        data: err.data || null,
      });
    }
  );

  return app;
};
