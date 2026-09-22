import { api } from "@/lib/axios";
import type { ApiResponse, Paginated } from "@/types/api";
import type { AuditLogListParams, AuditLogPage } from "@/types/audit";
import type {
  CreateGroupPayload,
  Group,
  GroupDetail,
  GroupListParams,
  GroupMember,
  MembershipChange,
  UpdateGroupPayload,
} from "@/types/group";

/**
 * Groupes de véhicules et groupes de boîtiers.
 *
 * Le back-end sert les deux familles depuis un socle commun
 * (`GroupControllerBase`) : mêmes routes à un segment près, même corps à une
 * clé près. Une fabrique suffit donc ici aussi — deux fichiers jumeaux
 * dériveraient tôt ou tard.
 */
interface GroupEndpoints {
  /** Segment d'URL : `vehicle-groups` | `device-groups`. */
  resource: "vehicle-groups" | "device-groups";
  /** Segment des membres : `vehicles` | `devices`. */
  members: "vehicles" | "devices";
  /** Clé du corps d'affectation : `vehicleIds` | `deviceIds`. */
  payloadKey: "vehicleIds" | "deviceIds";
}

function createGroupService({ resource, members, payloadKey }: GroupEndpoints) {
  return {
    /** GET /:famille?page=&perPage=&search= — chaque ligne porte son effectif. */
    async list(params: GroupListParams = {}): Promise<Paginated<Group>> {
      const { data } = await api.get<Paginated<Group>>(`/${resource}`, { params });
      return data;
    },

    /** GET /:famille/:id — le groupe ET la liste complète de ses membres. */
    async get(id: string): Promise<GroupDetail> {
      const { data } = await api.get<ApiResponse<GroupDetail>>(`/${resource}/${id}`);
      return data.data;
    },

    /** POST /:famille — 409 `E_GROUP_NAME_TAKEN` si le nom est déjà pris. */
    async create(payload: CreateGroupPayload): Promise<Group> {
      const { data } = await api.post<ApiResponse<Group>>(`/${resource}`, payload);
      return data.data;
    },

    /** PATCH /:famille/:id */
    async update(id: string, payload: UpdateGroupPayload): Promise<Group> {
      const { data } = await api.patch<ApiResponse<Group>>(`/${resource}/${id}`, payload);
      return data.data;
    },

    /** DELETE /:famille/:id — suppression LOGIQUE : le groupe reste référencé par l'audit. */
    async remove(id: string): Promise<void> {
      await api.delete(`/${resource}/${id}`);
    },

    /** GET /:famille/:id/(vehicles|devices) — membres seuls. */
    async members(id: string): Promise<GroupMember[]> {
      const { data } = await api.get<ApiResponse<GroupMember[], { total: number }>>(`/${resource}/${id}/${members}`);
      return data.data;
    },

    /** POST /:famille/:id/(vehicles|devices) — affectation en lot, idempotente (≤ 200). */
    async assign(id: string, memberIds: string[]): Promise<MembershipChange> {
      const { data } = await api.post<ApiResponse<MembershipChange>>(`/${resource}/${id}/${members}`, {
        [payloadKey]: memberIds,
      });
      return data.data;
    },

    /** DELETE /:famille/:id/(vehicles|devices)/:memberId — 404 si le membre n'est plus du groupe. */
    async unassign(id: string, memberId: string): Promise<void> {
      await api.delete(`/${resource}/${id}/${members}/${memberId}`);
    },

    /**
     * GET /:famille/:id/audit-logs — journal du groupe.
     *
     * Réunit trois ensembles : le groupe, ses membres, et les COMMANDES
     * émises sur ces membres (les immobilisations sont tracées sous
     * `device_command`, jamais sous `vehicle` ni `device`).
     */
    async auditLogs(id: string, params: AuditLogListParams = {}): Promise<AuditLogPage> {
      const { data } = await api.get<AuditLogPage>(`/${resource}/${id}/audit-logs`, { params });
      return data;
    },

    /** POST /organizations/:organizationId/:famille — création pour une autre organisation (exploitant). */
    async createForOrganization(organizationId: string, payload: CreateGroupPayload): Promise<Group> {
      const { data } = await api.post<ApiResponse<Group>>(`/organizations/${organizationId}/${resource}`, payload);
      return data.data;
    },

    /** GET /organizations/:organizationId/:famille — groupes d'une organisation désignée (exploitant). */
    async listForOrganization(organizationId: string, params: GroupListParams = {}): Promise<Paginated<Group>> {
      const { data } = await api.get<Paginated<Group>>(`/organizations/${organizationId}/${resource}`, { params });
      return data;
    },
  };
}

export type GroupService = ReturnType<typeof createGroupService>;

export const vehicleGroupService = createGroupService({
  resource: "vehicle-groups",
  members: "vehicles",
  payloadKey: "vehicleIds",
});

export const deviceGroupService = createGroupService({
  resource: "device-groups",
  members: "devices",
  payloadKey: "deviceIds",
});
