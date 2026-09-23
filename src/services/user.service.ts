import { adminPath, api } from "@/lib/axios";
import type { ApiResponse, Paginated } from "@/types/api";
import type { CreateUserPayload, UpdateUserPayload, User, UserDetail, UserListParams } from "@/types/user";

/**
 * Utilisateurs — routes `/admin/users` : comptes de toutes les organisations.
 * Les lignes de liste portent `organization` et `role`.
 */
export const userService = {
  /** GET /admin/users?organizationId=&roleId=&status=&search=&page=&perPage= */
  async list(params: UserListParams = {}): Promise<Paginated<User>> {
    const { data } = await api.get<Paginated<User>>(adminPath("/users"), { params });
    return data;
  },

  /** GET /admin/users/:id — avec son rôle et son organisation. */
  async get(id: string): Promise<UserDetail> {
    const { data } = await api.get<ApiResponse<UserDetail>>(adminPath(`/users/${id}`));
    return data.data;
  },

  /**
   * POST /admin/users — `organizationId` obligatoire. Le rôle doit être un
   * rôle système ou un rôle de CETTE organisation (sinon 422).
   */
  async create(payload: CreateUserPayload): Promise<User> {
    const { data } = await api.post<ApiResponse<User>>(adminPath("/users"), payload);
    return data.data;
  },

  /** PATCH /admin/users/:id */
  async update(id: string, payload: UpdateUserPayload): Promise<User> {
    const { data } = await api.patch<ApiResponse<User>>(adminPath(`/users/${id}`), payload);
    return data.data;
  },

  /** POST /admin/users/:id/suspend — révoque aussi tous ses jetons. */
  async suspend(id: string): Promise<User> {
    const { data } = await api.post<ApiResponse<User>>(adminPath(`/users/${id}/suspend`));
    return data.data;
  },

  /** POST /admin/users/:id/activate — lève la suspension et le verrouillage. */
  async activate(id: string): Promise<User> {
    const { data } = await api.post<ApiResponse<User>>(adminPath(`/users/${id}/activate`));
    return data.data;
  },

  /** DELETE /admin/users/:id — suppression logique, impossible sur son propre compte. */
  async remove(id: string): Promise<void> {
    await api.delete(adminPath(`/users/${id}`));
  },
};
