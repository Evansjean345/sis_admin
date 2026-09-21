"use client";

import dynamic from "next/dynamic";

import { Skeleton } from "@/components/ui/skeleton";

import type { FleetMapProps } from "./map";

/** Leaflet manipule `window` : la carte n'est rendue que côté navigateur. */
export const FleetMap = dynamic<FleetMapProps>(() => import("./map"), {
  ssr: false,
  loading: () => <Skeleton className="size-full rounded-none" />,
});
