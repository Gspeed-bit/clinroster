import { compareSync, hashSync } from "bcryptjs";
import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { getKeys } from "../config/keys";
import { StatusCodes } from "../utils/apiError";
import { requireAuth } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { AuthLoginSchema, AuthRegisterSchema } from "../schemas";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication endpoints
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     AuthRegisterRequest:
 *       type: object
 *       required: [email, password, role]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: admin@example.com
 *         password:
 *           type: string
 *           minLength: 6
 *           example: StrongPassw0rd!
 *         role:
 *           type: string
 *           enum: [admin, manager, nurse, viewer]
 *           example: manager
 *     AuthRegisterResponse:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: number
 *           example: 200
 *         message:
 *           type: string
 *           example: Registered
 *         data:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: 66fbd2d0f1b5a4c6e6b9c4a2
 *             email:
 *               type: string
 *               format: email
 *               example: admin@example.com
 *             role:
 *               type: string
 *               example: manager
 *     AuthLoginRequest:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: admin@example.com
 *         password:
 *           type: string
 *           example: StrongPassw0rd!
 *     AuthLoginResponse:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: number
 *           example: 200
 *         message:
 *           type: string
 *           example: OK
 *         data:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               description: JWT access token
 *               example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *             role:
 *               type: string
 *               example: admin
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: number
 *           example: 400
 *         message:
 *           type: string
 *           example: Invalid credentials
 *         data:
 *           nullable: true
 *           example: null
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user (admin only)
 *     description: Creates a new user with the given role. Requires admin privileges.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRegisterRequest'
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthRegisterResponse'
 *       400:
 *         description: Email already exists or validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized (no/invalid token)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden (not an admin)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  "/register",
  requireAuth(["admin"]),
  validateBody(AuthRegisterSchema),
  async (req: Request, res: Response) => {
    const { email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(StatusCodes.BAD_REQUEST).json({
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Email exists",
        data: null,
      });

    const passwordHash = hashSync(password, 10);
    const user = await User.create({ email, passwordHash, role, active: true });

    return res.status(StatusCodes.SUCCESS).json({
      statusCode: StatusCodes.SUCCESS,
      message: "Registered",
      data: { id: user._id, email, role },
    });
  }
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in and get a JWT
 *     description: Returns a signed JWT for accessing protected routes.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthLoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthLoginResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  "/login",
  validateBody(AuthLoginSchema),
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !compareSync(password, user.passwordHash)) {
      return res.status(StatusCodes.UNAUTHENTICATED).json({
        statusCode: StatusCodes.UNAUTHENTICATED,
        message: "Invalid credentials",
        data: null,
      });
    }

    const token = jwt.sign(
      { id: String(user._id), role: user.role },
      getKeys().secretKey,
      { expiresIn: "15m" }
    );

    return res.status(StatusCodes.SUCCESS).json({
      statusCode: StatusCodes.SUCCESS,
      message: "OK",
      data: { token, role: user.role },
    });
  }
);

export default router;
