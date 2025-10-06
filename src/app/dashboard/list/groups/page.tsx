"use client";

import GroupsList from "@/features/groups/components/GroupsList";

const Page = () => {
  return (
    <div className="w-auto pl-2">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold">Grupos</h1>
        <p className="text-sm text-gray-500">Gestiona los grupos del sistema.</p>
      </header>

      <div className="w-full rounded-2xl border border-gray-200/60 bg-white shadow-sm p-4">
        <GroupsList />
      </div>
    </div>
  );
};

export default Page;