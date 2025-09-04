import { z } from "zod";

export const AuthRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["admin", "supervisor", "nurse"]),
});
export const AuthLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const LeaveCreateSchema = z.object({
  type: z.enum([
    "annual",
    "sick",
    "unpaid",
    "training",
    "maternity",
    "paternity",
  ]),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.string().max(400).optional(),
});
export const DecisionSchema = z.object({
  decisionNote: z.string().max(400).optional(),
});

export const SwapCreateSchema = z.object({
  fromShiftId: z.string().min(1),
  toShiftId: z.string().min(1),
  reason: z.string().max(400).optional(),
});

export const GenerateRosterSchema = z.object({
  departmentId: z.string().min(1),
  templateId: z.string().min(1),
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
