import { adminPath, api } from "@/lib/axios";
import type {
  ActivityParams,
  ActivityReport,
  AdminCommand,
  AdminCommandListParams,
  AdminOverview,
  AdminStatsParams,
  CommandStats,
  DeviceStats,
  OrganizationStatsRow,
  UserStats,
  VehicleStats,
} from "@/types/admin";
import type { ApiResponse, Paginated } from "@/types/api";

/**
 * Statistiques et journaux du tableau de bord d'administration.
 * Toutes les routes sont sous `/api/v1/admin` (joker `*` exigé).
 */

async function getData<T>(path: string, params?: object): Promise<T> {
  const { data } = await api.get<ApiResponse<T>>(adminPath(path), { params });
  return data.data;
}

export const adminService = {
  /** GET /admin/overview — indicateurs de la page d'accueil, en un appel. */
  overview(): Promise<AdminOverview> {
    return getData<AdminOverview>("/overview");
  },

  /** GET /admin/stats/activity?days=&organizationId= — séries journalières des courbes. */
  activity(params: ActivityParams = {}): Promise<ActivityReport> {
    return getData<ActivityReport>("/stats/activity", params);
  },

  /** GET /admin/organizations/stats — comptes, véhicules, boîtiers par client. */
  organizationsStats(): Promise<OrganizationStatsRow[]> {
    return getData<OrganizationStatsRow[]>("/organizations/stats");
  },

  /** GET /admin/users/stats?organizationId= */
  usersStats(params: AdminStatsParams = {}): Promise<UserStats> {
    return getData<UserStats>("/users/stats", params);
  },

  /** GET /admin/vehicles/stats?organizationId= */
  vehiclesStats(params: AdminStatsParams = {}): Promise<VehicleStats> {
    return getData<VehicleStats>("/vehicles/stats", params);
  },

  /** GET /admin/devices/stats?organizationId= */
  devicesStats(params: AdminStatsParams = {}): Promise<DeviceStats> {
    return getData<DeviceStats>("/devices/stats", params);
  },

  /** GET /admin/commands/stats?organizationId= — 24 dernières heures + commandes en vol. */
  commandsStats(params: AdminStatsParams = {}): Promise<CommandStats> {
    return getData<CommandStats>("/commands/stats", params);
  },

  /** GET /admin/commands — journal de toutes les commandes, du plus récent au plus ancien. */
  async commands(params: AdminCommandListParams = {}): Promise<Paginated<AdminCommand>> {
    const { data } = await api.get<Paginated<AdminCommand>>(adminPath("/commands"), { params });
    return data;
  },
};
