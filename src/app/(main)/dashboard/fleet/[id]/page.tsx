import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";

import { Fleet } from "../_components/fleet";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense fallback={<Skeleton className="h-[70dvh] rounded-xl" />}>
      <Fleet vehicleId={id} />
    </Suspense>
  );
}
