"use client";

import { OrganizationDetail } from "./_components/organization-detail";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OrganizationDetail id={id} />;
}
