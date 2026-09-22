"use client";

import { GroupDetailScreen } from "../../_components/groups/group-detail-screen";
import { VEHICLE_GROUP_FAMILY } from "../../_components/groups/group-family";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <GroupDetailScreen family={VEHICLE_GROUP_FAMILY} id={id} />;
}
