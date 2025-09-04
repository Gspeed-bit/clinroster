// src/lib/utils.ts
import { type ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes intelligently.
 * Use like: cn("px-2 py-1", isActive && "bg-primary")
 */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
