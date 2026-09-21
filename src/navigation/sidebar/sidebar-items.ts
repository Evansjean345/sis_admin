import {
  Banknote,
  Cpu,
  HeartPulse,
  LayoutDashboard,
  Lock,
  type LucideIcon,
  Mail,
  MapPin,
  ReceiptText,
  Server,
  Truck,
  UserRound,
  Users,
  BuildingComplex,
  ServerCog,
  SquareParking,
  ShieldCog,
} from "lucide-react";

export type NavBadge = "new" | "soon";

export interface NavSubItem {
  id: string;
  title: string;
  url: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

interface NavItemBase {
  id: string;
  title: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

export interface NavMainLinkItem extends NavItemBase {
  url: string;
  subItems?: never;
}

export interface NavMainParentItem extends NavItemBase {
  subItems: NavSubItem[];
}

export type NavMainItem = NavMainLinkItem | NavMainParentItem;

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Dashboards",
    items: [
      {
        id: "default",
        title: "Home",
        url: "/dashboard/default",
        icon: LayoutDashboard,
      },
      {
        id: "billing",
        title: "Facturation",
        url: "/dashboard/billing",
        icon: Banknote,
      },
      {
        id: "fleet",
        title: "Suivi en temps réel",
        url: "/dashboard/fleet",
        icon: MapPin,
      },
      {
        id: "channel",
        title: "Canal de transmission",
        url: "/dashboard/channel",
        icon: Server,
      },
      {
        id: "vehicles",
        title: "Véhicules",
        url: "/dashboard/vehicles",
        icon: Truck,
      },
      {
        id: "device",
        title: "Trackers",
        url: "/dashboard/device",
        icon: Cpu,
      },
      {
        id: "entreprises",
        title: "Entreprises",
        url: "/dashboard/entreprises",
        icon: BuildingComplex,
      },
      {
        id: "group_device",
        title: "Lots de trackers",
        url: "/dashboard/group_device",
        icon: ServerCog,
      },
      {
        id: "group_vehicle",
        title: "Administrer une Flotte",
        url: "/dashboard/group_vehicle",
        icon: SquareParking,
      },
      {
        id: "audit",
        title: "Zone d'audit",
        url: "/dashboard/audit",
        icon: ShieldCog,
      },
    ],
  },
  {
    id: 2,
    label: "Pages",
    items: [
      {
        id: "email",
        title: "alertes et notifications",
        url: "/dashboard/mail",
        icon: Mail,
      },
      {
        id: "invoice",
        title: "Factures",
        url: "/dashboard/invoice",
        icon: ReceiptText,
      },
      {
        id: "profile",
        title: "Mon profil",
        url: "/dashboard/profile",
        icon: UserRound,
      },
      {
        id: "users",
        title: "Utilisateurs",
        url: "/dashboard/users",
        icon: Users,
      },
      {
        id: "roles",
        title: "Rôles et permissions",
        url: "/dashboard/roles",
        icon: Lock,
      },
    ],
  },
  /*
  {
    id: 3,
    label: "Legacy",
    items: [
      {
        id: "legacy-dashboards",
        title: "Dashboards",
        subItems: [
          {
            id: "legacy-default",
            title: "Default V1",
            url: "/dashboard/default-v1",
          },
          { id: "legacy-crm", title: "CRM V1", url: "/dashboard/crm-v1" },
          {
            id: "legacy-finance",
            title: "Finance V1",
            url: "/dashboard/finance-v1",
          },
          {
            id: "legacy-analytics",
            title: "Analytics V1",
            url: "/dashboard/analytics-v1",
          },
        ],
      },
    ],
  }, */
];
