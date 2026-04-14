"use client";

import { useState } from "react";

function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function MonthExport() {
  const [month, setMonth] = useState(currentMonth());

  return (
    <div className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Mes</span>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
        />
      </label>
      <a
        href={`/api/export?month=${month}`}
        className="block w-full rounded-lg bg-slate-900 px-4 py-2 text-center font-medium text-white hover:bg-slate-800"
      >
        Descargar Excel
      </a>
    </div>
  );
}
