import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { Role } from "@/types/role";

export const roleService = {
  /** GET /roles */
  async list(): Promise<Role[]> {
    const { data } = await api.get<ApiResponse<Role[]>>("/roles");
    return data.data;
  },
};
