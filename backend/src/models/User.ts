import { Schema, model, Types } from "mongoose";

export type UserRole = "admin" | "supervisor" | "nurse";
export interface IUser {
  _id: Types.ObjectId;
  email: string;
  passwordHash: string;
  role: UserRole;
  active: boolean;
}
const UserSchema = new Schema<IUser>(
  {
    email: { type: String, unique: true, required: true, index: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "supervisor", "nurse"],
      required: true,
    },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", UserSchema);
