import { Suspense } from "react";
import dynamic from "next/dynamic";

export const nextdynamic = "force-dynamic";

const AdmissionsDetailsClient = dynamic(
  () => import("./AdmissionsDetailsClient") // <- sin { ssr: false }
);

export default function Page() {
  return (
    <Suspense fallback={<div className="p-4 text-sm">Cargando…</div>}>
      <AdmissionsDetailsClient />
    </Suspense>
  );
}
