import { Suspense } from "react";

import { LoadingRows } from "@/components/query-state";

import { AdminDashboard } from "./_components/admin-dashboard";

/** Accueil du tableau de bord d'administration — alimenté par /api/v1/admin/*. */
export default function Page() {
  return (
    // `useSearchParams` (filtre d'organisation) exige une frontière Suspense au build.
    <Suspense fallback={<LoadingRows rows={8} />}>
      <AdminDashboard />
    </Suspense>
  );
}
