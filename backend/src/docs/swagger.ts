import swaggerJsdoc from "swagger-jsdoc";
import { getKeys } from "../config/keys";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.1",
    info: {
      title: " ClinRoster",
      version: "1.0.0",
      description:
        "API for students, counsellors, and admins. Includes consent-gated resources.",
    },
    servers: [
      {
        url: getKeys().publicBaseUrl,
        description: "Base URL",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
      schemas: {},
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/**/*.ts"],
});
