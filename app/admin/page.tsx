import { MonthExport } from "@/components/MonthExport";

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-1 text-2xl font-bold">Administración</h1>
      <p className="mb-6 text-sm text-slate-600">
        Descarga el Excel mensual con todos los repostajes del mes seleccionado.
      </p>
      <MonthExport />
    </div>
  );
}
