import type { DeviceListParams } from "@/types/device";
import type { UserListParams } from "@/types/user";
import type { VehicleListParams } from "@/types/vehicle";

/** Clés React Query centralisées : une invalidation = un préfixe. */
export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  roles: {
    all: ["roles"] as const,
  },
  users: {
    all: ["users"] as const,
    list: (params: UserListParams) => ["users", "list", params] as const,
    detail: (id: string) => ["users", "detail", id] as const,
  },
  vehicles: {
    all: ["vehicles"] as const,
    list: (params: VehicleListParams) => ["vehicles", "list", params] as const,
    detail: (id: string) => ["vehicles", "detail", id] as const,
  },
  devices: {
    all: ["devices"] as const,
    list: (params: DeviceListParams) => ["devices", "list", params] as const,
    detail: (id: string) => ["devices", "detail", id] as const,
    diagnostic: (id: string) => ["devices", "diagnostic", id] as const,
    telemetry: (id: string) => ["devices", "telemetry", id] as const,
    logs: (id: string, count: number) => ["devices", "logs", id, count] as const,
  },
  commands: {
    all: (deviceId: string) => ["commands", deviceId] as const,
    history: (deviceId: string) => ["commands", deviceId, "history"] as const,
    catalog: (deviceId: string) => ["commands", deviceId, "catalog"] as const,
    flespiCatalog: (deviceId: string) => ["commands", deviceId, "flespi-catalog"] as const,
  },
  flespi: {
    all: ["flespi"] as const,
    health: ["flespi", "health"] as const,
    channels: ["flespi", "channels"] as const,
    connections: (id: number) => ["flespi", "channels", id, "connections"] as const,
    logs: (id: number, count: number) => ["flespi", "channels", id, "logs", count] as const,
    idents: (id: number) => ["flespi", "channels", id, "idents"] as const,
    deviceTypes: (protocol: string, search?: string) => ["flespi", "device-types", protocol, search ?? ""] as const,
  },
};
