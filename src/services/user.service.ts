import { api } from "@/lib/axios";
import type { ApiResponse, Paginated } from "@/types/api";
import type { CreateUserPayload, UpdateUserPayload, User, UserDetail, UserListParams } from "@/types/user";

export const userService = {
  /** GET /users?page=&perPage=&status= */
  async list(params: UserListParams = {}): Promise<Paginated<User>> {
    const { data } = await api.get<Paginated<User>>("/users", { params });
    return data;
  },

  /** GET /users/:id */
  async get(id: string): Promise<UserDetail> {
    const { data } = await api.get<ApiResponse<UserDetail>>(`/users/${id}`);
    return data.data;
  },

  /** POST /users */
  async create(payload: CreateUserPayload): Promise<User> {
    const { data } = await api.post<ApiResponse<User>>("/users", payload);
    return data.data;
  },

  /** PATCH /users/:id */
  async update(id: string, payload: UpdateUserPayload): Promise<User> {
    const { data } = await api.patch<ApiResponse<User>>(`/users/${id}`, payload);
    return data.data;
  },

  /** POST /users/:id/suspend — révoque aussi tous ses jetons. */
  async suspend(id: string): Promise<User> {
    const { data } = await api.post<ApiResponse<User>>(`/users/${id}/suspend`);
    return data.data;
  },

  /** DELETE /users/:id — suppression logique, impossible sur son propre compte. */
  async remove(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};
