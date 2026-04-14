import { RefuelForm } from "@/components/RefuelForm";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-1 text-2xl font-bold">Nuevo repostaje</h1>
      <p className="mb-6 text-sm text-slate-600">
        Rellena los datos del repostaje. Los kilómetros son los del cuentakilómetros del vehículo
        en el momento de repostar.
      </p>
      <RefuelForm />
    </div>
  );
}
