import { api } from "@/lib/axios";
import { toTrackPoints } from "@/lib/track";
import type { ApiResponse, Paginated } from "@/types/api";
import type {
  AssignDevicePayload,
  CreateDeviceMeta,
  CreateDevicePayload,
  Device,
  DeviceDetail,
  DeviceDiagnostic,
  DeviceListParams,
  DeviceTelemetry,
  FlespiLogEntry,
  LogQueryParams,
  SyncDeviceFlespiPayload,
  UpdateDevicePayload,
} from "@/types/device";
import type { TrackPoint, TrackRange } from "@/types/track";

export const deviceService = {
  /** GET /devices?status=&search=&unassigned= */
  async list(params: DeviceListParams = {}): Promise<Paginated<Device>> {
    const { data } = await api.get<Paginated<Device>>("/devices", { params });
    return data;
  },

  /** GET /devices/:id — inclut l'affectation en cours. */
  async get(id: string): Promise<DeviceDetail> {
    const { data } = await api.get<ApiResponse<DeviceDetail>>(`/devices/${id}`);
    return data.data;
  },

  /** POST /devices — `syncFlespi: true` crée aussi le device chez flespi. */
  async create(payload: CreateDevicePayload): Promise<ApiResponse<Device, CreateDeviceMeta>> {
    const { data } = await api.post<ApiResponse<Device, CreateDeviceMeta>>("/devices", payload);
    return data;
  },

  /** PATCH /devices/:id */
  async update(id: string, payload: UpdateDevicePayload): Promise<Device> {
    const { data } = await api.patch<ApiResponse<Device>>(`/devices/${id}`, payload);
    return data.data;
  },

  /** DELETE /devices/:id — refusé (409) si le boîtier est encore monté. */
  async remove(id: string): Promise<void> {
    await api.delete(`/devices/${id}`);
  },

  /** POST /devices/:id/flespi/sync — rattacher après coup à flespi. */
  async syncFlespi(id: string, payload: SyncDeviceFlespiPayload): Promise<Device> {
    const { data } = await api.post<ApiResponse<Device>>(`/devices/${id}/flespi/sync`, payload);
    return data.data;
  },

  /** POST /devices/:id/assignment — montage daté sur un véhicule. */
  async assign(id: string, payload: AssignDevicePayload): Promise<{ deviceId: string; vehicleId: string }> {
    const { data } = await api.post<ApiResponse<{ deviceId: string; vehicleId: string }>>(
      `/devices/${id}/assignment`,
      payload,
    );
    return data.data;
  },

  /** DELETE /devices/:id/assignment — démontage. */
  async unassign(id: string): Promise<void> {
    await api.delete(`/devices/${id}/assignment`);
  },

  /** GET /devices/:id/flespi — diagnostic complet (protocole, ident, dernière trame, problèmes). */
  async diagnostic(id: string): Promise<DeviceDiagnostic> {
    const { data } = await api.get<ApiResponse<DeviceDiagnostic>>(`/devices/${id}/flespi`);
    return data.data;
  },

  /** GET /devices/:id/flespi/logs?count= — journal de connexion flespi. */
  async logs(id: string, params: LogQueryParams = { count: 50 }): Promise<FlespiLogEntry[]> {
    const { data } = await api.get<ApiResponse<FlespiLogEntry[]>>(`/devices/${id}/flespi/logs`, { params });
    return data.data;
  },

  /** GET /devices/:id/flespi/telemetry — dernière valeur de chaque paramètre. */
  async telemetry(id: string): Promise<DeviceTelemetry> {
    const { data } = await api.get<ApiResponse<DeviceTelemetry>>(`/devices/${id}/flespi/telemetry`);
    return data.data;
  },

  /** GET /devices/:id/telemetry/history?from=&to= — messages bruts flespi sur une fenêtre. */
  async telemetryHistory(
    id: string,
    params: Required<Pick<LogQueryParams, "from" | "to">> & { count?: number },
  ): Promise<{ source: "flespi"; count: number; messages: Array<Record<string, unknown>> }> {
    const { data } = await api.get<
      ApiResponse<{ source: "flespi"; count: number; messages: Array<Record<string, unknown>> }>
    >(`/devices/${id}/telemetry/history`, { params });
    return data.data;
  },

  /**
   * Trajet sur une fenêtre, reconstruit depuis l'historique flespi.
   * L'API plafonne à 1000 messages par appel : on pagine en avançant `from`
   * après le dernier message reçu (10 pages max = 10 000 points).
   */
  async track(id: string, range: TrackRange, options: { onlyValidFix?: boolean } = {}): Promise<TrackPoint[]> {
    const PAGE = 1000;
    const all: Array<Record<string, unknown>> = [];
    let from = range.from.getTime();
    const to = range.to.getTime();
    for (let page = 0; page < 10 && from <= to; page++) {
      const res = await deviceService.telemetryHistory(id, {
        from: new Date(from).toISOString(),
        to: new Date(to).toISOString(),
        count: PAGE,
      });
      all.push(...res.messages);
      if (res.messages.length < PAGE) break;
      const lastTs = Number(res.messages[res.messages.length - 1]?.timestamp);
      if (!Number.isFinite(lastTs)) break;
      // Les bornes flespi sont à la seconde : on repart à la seconde suivante.
      from = Math.floor(lastTs) * 1000 + 1000;
    }
    return toTrackPoints(all, options);
  },
};
