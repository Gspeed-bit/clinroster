import { api } from "@/lib/api";
import {
  LoginFormSchema,
  LoginResponseSchema,
  RegisterFormSchema,
  RegisterResponseSchema,
} from "@/schemas/auth";

export const authApi = {
  async login(payload: unknown) {
    const form = LoginFormSchema.parse(payload);
    const res = await api.post("/auth/login", form);
    const parsed = LoginResponseSchema.parse(res.data);
    if (!parsed.data) throw new Error("Empty login response");
    return parsed.data; // { token, role }
  },

  async register(payload: unknown) {
    const form = RegisterFormSchema.parse(payload);
    const res = await api.post("/auth/register", form);
    const parsed = RegisterResponseSchema.parse(res.data);
    if (!parsed.data) throw new Error("Empty register response");
    return parsed.data;
  },
};
