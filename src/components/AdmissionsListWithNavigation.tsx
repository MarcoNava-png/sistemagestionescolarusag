"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { AdmissionsList } from "./AdmisionesList";

export function AdmissionsListWithNavigation() {
  const router = useRouter();

  const handleRowDoubleClick = useCallback((a: any) => {
    router.push(
      `/dashboard/list/admissions/detailsapplicants?idAspirante=${encodeURIComponent(
        a.idAspirante
      )}`
    );
  }, [router]);

  return <AdmissionsList onRowDoubleClick={handleRowDoubleClick} />;
}
