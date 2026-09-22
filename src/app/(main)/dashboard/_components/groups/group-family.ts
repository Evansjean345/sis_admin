import { Cpu, type LucideIcon, ServerCog, SquareParking, Truck } from "lucide-react";

import type { GroupKind } from "@/types/group";

/**
 * Vocabulaire d'une famille de groupes.
 *
 * Les deux écrans (flottes de véhicules, lots de boîtiers) partagent leurs
 * composants : ce qui change tient dans cet objet — les mots, la route et
 * les icônes. Ajouter une troisième famille se réduirait à une entrée ici.
 */
export interface GroupFamily {
  kind: GroupKind;
  /** Racine de la route, sans barre finale. */
  route: string;
  title: string;
  description: string;
  /** « une flotte », « un lot » — utilisé dans les phrases. */
  singular: string;
  singularWithArticle: string;
  memberSingular: string;
  memberPlural: string;
  /** En-tête de la colonne d'étiquette des membres. */
  memberColumnLabel: string;
  /** Route de détail d'un membre, pour lier la liste au reste du tableau de bord. */
  memberRoute: string;
  /** Longueur minimale de recherche acceptée par l'API des membres. */
  memberSearchMinLength: number;
  memberSearchPlaceholder: string;
  icon: LucideIcon;
  memberIcon: LucideIcon;
}

export const VEHICLE_GROUP_FAMILY: GroupFamily = {
  kind: "vehicle_group",
  route: "/dashboard/group_vehicle",
  title: "Flottes",
  description: "Regroupez vos véhicules par flotte pour les piloter et les auditer ensemble.",
  singular: "flotte",
  singularWithArticle: "une flotte",
  memberSingular: "véhicule",
  memberPlural: "véhicules",
  memberColumnLabel: "Immatriculation",
  memberRoute: "/dashboard/vehicles",
  memberSearchMinLength: 1,
  memberSearchPlaceholder: "Rechercher une immatriculation…",
  icon: SquareParking,
  memberIcon: Truck,
};

export const DEVICE_GROUP_FAMILY: GroupFamily = {
  kind: "device_group",
  route: "/dashboard/group_device",
  title: "Lots de trackers",
  description: "Regroupez vos boîtiers par lot pour suivre un parc, une campagne ou un déploiement.",
  singular: "lot",
  singularWithArticle: "un lot",
  memberSingular: "boîtier",
  memberPlural: "boîtiers",
  memberColumnLabel: "IMEI",
  memberRoute: "/dashboard/device",
  // L'API des boîtiers refuse une recherche de moins de 3 caractères.
  memberSearchMinLength: 3,
  memberSearchPlaceholder: "Rechercher un IMEI (3 caractères minimum)…",
  icon: ServerCog,
  memberIcon: Cpu,
};

export const groupFamilies: Record<GroupKind, GroupFamily> = {
  vehicle_group: VEHICLE_GROUP_FAMILY,
  device_group: DEVICE_GROUP_FAMILY,
};
