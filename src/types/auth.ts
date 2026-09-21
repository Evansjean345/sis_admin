export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

/** Réponse de POST /auth/login et de POST /users/me/password. */
export interface AuthSession {
  token: string;
  expiresAt: string;
  user: AuthUser;
}

/** GET /auth/me */
export interface CurrentUser extends AuthUser {
  organizationId: string;
  roleId: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  newPassword_confirmation: string;
}
