import { api } from "@/lib/axios";
import type { ApiResponse, Paginated } from "@/types/api";
import type {
  CreateVehiclePayload,
  UpdateVehiclePayload,
  Vehicle,
  VehicleDetail,
  VehicleListParams,
} from "@/types/vehicle";

export const vehicleService = {
  /** GET /vehicles?search=&status=&page=&perPage= */
  async list(params: VehicleListParams = {}): Promise<Paginated<Vehicle>> {
    const { data } = await api.get<Paginated<Vehicle>>("/vehicles", { params });
    return data;
  },

  /** GET /vehicles/:id — inclut le boîtier monté et la dernière position. */
  async get(id: string): Promise<VehicleDetail> {
    const { data } = await api.get<ApiResponse<VehicleDetail>>(`/vehicles/${id}`);
    return data.data;
  },

  /** POST /vehicles */
  async create(payload: CreateVehiclePayload): Promise<Vehicle> {
    const { data } = await api.post<ApiResponse<Vehicle>>("/vehicles", payload);
    return data.data;
  },

  /** PATCH /vehicles/:id — ex. { speedLimitKph: 120 } */
  async update(id: string, payload: UpdateVehiclePayload): Promise<Vehicle> {
    const { data } = await api.patch<ApiResponse<Vehicle>>(`/vehicles/${id}`, payload);
    return data.data;
  },

  /** DELETE /vehicles/:id — archivage logique. */
  async remove(id: string): Promise<void> {
    await api.delete(`/vehicles/${id}`);
  },
};
