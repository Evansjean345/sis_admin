export type RoleCode = "super_admin" | "admin" | "supervisor" | "operator" | "viewer" | (string & {});

/** GET /roles — champs en snake_case pour `is_system`, tel que renvoyé par l'API. */
export interface Role {
  id: string;
  code: RoleCode;
  name: string;
  description: string | null;
  permissions: string[];
  is_system: boolean;
}

/** Rôle embarqué dans GET /users/:id */
export interface UserRole {
  id: string;
  code: RoleCode;
  name: string;
  permissions: string[];
}
