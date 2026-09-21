import type { PaginationParams } from "./api";
import type { UserRole } from "./role";

export type UserStatus = "pending" | "active" | "suspended";

export interface User {
  id: string;
  organizationId: string;
  roleId: string;
  email: string;
  fullName: string;
  phone: string | null;
  status: UserStatus;
  locale: "fr" | "en";
  timezone: string;
  lastLoginAt: string | null;
  lastLoginIp: string | null;
  failedAttempts: number;
  lockedUntil: string | null;
  passwordChangedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserDetail extends User {
  role?: UserRole;
}

export interface UserListParams extends PaginationParams {
  status?: UserStatus;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  roleId: string;
  status?: UserStatus;
}

export interface UpdateUserPayload {
  fullName?: string;
  phone?: string;
  roleId?: string;
  status?: UserStatus;
  locale?: "fr" | "en";
  timezone?: string;
}
