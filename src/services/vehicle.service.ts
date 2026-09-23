import { adminPath, api } from "@/lib/axios";
import type { ApiResponse, Paginated } from "@/types/api";
import type {
  CreateVehiclePayload,
  UpdateVehiclePayload,
  Vehicle,
  VehicleDetail,
  VehicleListParams,
} from "@/types/vehicle";

/**
 * Véhicules — routes `/admin/vehicles` : toutes les organisations.
 * Chaque ligne et chaque détail portent leur `organization`.
 */
export const vehicleService = {
  /** GET /admin/vehicles?organizationId=&search=&status=&page=&perPage= */
  async list(params: VehicleListParams = {}): Promise<Paginated<Vehicle>> {
    const { data } = await api.get<Paginated<Vehicle>>(adminPath("/vehicles"), { params });
    return data;
  },

  /** GET /admin/vehicles/:id — inclut le boîtier monté et la dernière position. */
  async get(id: string): Promise<VehicleDetail> {
    const { data } = await api.get<ApiResponse<VehicleDetail>>(adminPath(`/vehicles/${id}`));
    return data.data;
  },

  /** POST /admin/vehicles — `organizationId` obligatoire. */
  async create(payload: CreateVehiclePayload): Promise<Vehicle> {
    const { data } = await api.post<ApiResponse<Vehicle>>(adminPath("/vehicles"), payload);
    return data.data;
  },

  /** PATCH /admin/vehicles/:id — ex. { speedLimitKph: 120 } */
  async update(id: string, payload: UpdateVehiclePayload): Promise<Vehicle> {
    const { data } = await api.patch<ApiResponse<Vehicle>>(adminPath(`/vehicles/${id}`), payload);
    return data.data;
  },

  /** DELETE /admin/vehicles/:id — archivage logique. */
  async remove(id: string): Promise<void> {
    await api.delete(adminPath(`/vehicles/${id}`));
  },
};
