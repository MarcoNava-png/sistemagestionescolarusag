// app/dashboard/list/admissions/page.tsx
import { AdmissionsList } from "@/features/admisiones/components/AdmisionesList";
import { AdmissionFormModal } from "@/features/admisiones/components/modals/AdmisionesFormModal";

export default function Page({
  searchParams,
}: {
  searchParams: { [k: string]: string | undefined };
}) {
  return (
      <div className="grid gap-6 grid-cols-1 items-start">
        <section className="min-w-0">
          <div className="w-full min-w-0 rounded-2xl border border-gray-200/60 bg-white shadow-sm p-4">
            <AdmissionsList />
          </div>
        </section>
      </div>


  );
}
