import type { StatusTone } from "@/components/status-badge";
import type { AuditResourceType } from "@/types/audit";

/**
 * Traduction de la nomenclature d'audit.
 *
 * Les actions suivent `domaine.ressource.verbe`
 * (`fleet.vehicle_group.members_added`). Plutôt qu'un dictionnaire à tenir à
 * jour action par action — l'API en ajoute à chaque jalon —, on traduit
 * chaque segment et on recompose. Une action inconnue reste lisible.
 */

const DOMAINS: Record<string, string> = {
  fleet: "Flotte",
  identity: "Identité",
  security: "Sécurité",
  billing: "Facturation",
  telemetry: "Télémétrie",
};

const RESOURCES: Record<string, string> = {
  organization: "organisation",
  user: "utilisateur",
  role: "rôle",
  vehicle: "véhicule",
  device: "boîtier",
  vehicle_group: "groupe de véhicules",
  device_group: "groupe de boîtiers",
  device_command: "commande",
  geofence: "géofence",
  policy: "politique",
  engine_cut: "coupure moteur",
  engine_restore: "rétablissement moteur",
  immobilization: "immobilisation",
  alert: "alerte",
  incident: "incident",
};

const VERBS: Record<string, string> = {
  created: "création",
  updated: "modification",
  deleted: "suppression",
  members_added: "membres ajoutés",
  members_removed: "membres retirés",
  requested: "demande",
  approve: "validation",
  approved: "validation",
  rejected: "refus",
  queued: "mise en file",
  sent: "émission",
  acknowledged: "acquittement",
  failed: "échec",
  expired: "expiration",
  assigned: "affectation",
  unassigned: "retrait",
  login: "connexion",
  logout: "déconnexion",
};

function humanize(segment: string): string {
  return segment.replaceAll("_", " ");
}

/** `fleet.vehicle_group.members_added` → « Flotte · groupe de véhicules · membres ajoutés ». */
export function auditActionLabel(action: string): string {
  const [domain, resource, ...rest] = action.split(".");
  const verb = rest.join(".");
  const parts = [
    DOMAINS[domain] ?? humanize(domain ?? ""),
    RESOURCES[resource] ?? humanize(resource ?? ""),
    VERBS[verb] ?? humanize(verb),
  ].filter(Boolean);
  return parts.join(" · ");
}

/** Forme courte pour les colonnes étroites : seulement le verbe. */
export function auditActionShortLabel(action: string): string {
  const verb = action.split(".").slice(2).join(".");
  return VERBS[verb] ?? humanize(verb || action);
}

export function auditResourceLabel(resourceType: AuditResourceType): string {
  return RESOURCES[resourceType] ?? humanize(String(resourceType));
}

/**
 * Teinte du badge d'action.
 *
 * Le domaine `security` prime : une coupure moteur ne doit jamais se lire
 * comme une modification ordinaire, même quand son verbe est neutre.
 */
export function auditActionTone(action: string): StatusTone {
  const [domain, , ...rest] = action.split(".");
  const verb = rest.join(".");

  if (verb === "failed" || verb === "rejected" || verb === "deleted") return "danger";
  if (domain === "security") return verb === "sent" || verb === "queued" ? "orange" : "warning";
  if (verb === "created" || verb === "members_added" || verb === "acknowledged") return "success";
  if (verb === "members_removed" || verb === "unassigned") return "orange";
  if (verb === "updated" || verb === "assigned") return "info";
  return "neutral";
}

/** Acteur lisible : nom, à défaut e-mail, à défaut le type d'acteur. */
export function auditActorLabel(entry: { actorName: string | null; actorEmail: string | null; actorType: string }) {
  return entry.actorName ?? entry.actorEmail ?? (entry.actorType === "system" ? "Système" : entry.actorType);
}

/** Types de ressources proposés dans le filtre — ceux que le jalon 2 produit. */
export const AUDIT_RESOURCE_TYPES: AuditResourceType[] = [
  "organization",
  "user",
  "vehicle",
  "device",
  "vehicle_group",
  "device_group",
  "device_command",
  "geofence",
  "policy",
];
