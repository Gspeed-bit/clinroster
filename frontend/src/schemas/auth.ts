import { z } from "zod";

// Server roles
export const UserRoleSchema = z.enum(["admin", "supervisor", "nurse"]);
export type UserRole = z.infer<typeof UserRoleSchema>;

// Common API envelope: { statusCode, message, data }
export const apiEnvelope = <T extends z.ZodTypeAny>(data: T) =>
  z.object({
    statusCode: z.number(),
    message: z.string(),
    data: data.nullable(),
  });

// ----- Login
export const LoginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export const LoginResponseDataSchema = z.object({
  token: z.string(),
  role: UserRoleSchema,
});
export const LoginResponseSchema = apiEnvelope(LoginResponseDataSchema);
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

// ----- Register
export const RegisterFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: UserRoleSchema,
});
export const RegisterResponseDataSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  role: UserRoleSchema,
});
export const RegisterResponseSchema = apiEnvelope(RegisterResponseDataSchema);
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;
