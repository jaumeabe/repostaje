"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function todayLocalISO() {
  const d = new Date();
  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
}

export function RefuelForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOk(false);

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      employeeName: String(data.get("employeeName") || "").trim(),
      plate: String(data.get("plate") || "").trim().toUpperCase(),
      station: String(data.get("station") || "").trim(),
      liters: Number(data.get("liters")),
      amount: Number(data.get("amount")),
      odometerKm: Number(data.get("odometerKm")),
      refueledAt: String(data.get("refueledAt")),
    };

    try {
      const res = await fetch("/api/refuels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Error al guardar");
      }
      setOk(true);
      form.reset();
      (form.elements.namedItem("refueledAt") as HTMLInputElement).value = todayLocalISO();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-xl border bg-white p-6 shadow-sm"
    >
      <Field label="Empleado" name="employeeName" placeholder="Nombre y apellidos" required />
      <Field label="Matrícula" name="plate" placeholder="1234ABC" required />
      <Field label="Gasolinera" name="station" placeholder="Repsol Avenida..." required />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Litros" name="liters" type="number" step="0.01" min="0" required />
        <Field label="Importe (€)" name="amount" type="number" step="0.01" min="0" required />
      </div>
      <Field
        label="Kilómetros del vehículo"
        name="odometerKm"
        type="number"
        step="1"
        min="0"
        required
      />
      <Field
        label="Fecha y hora"
        name="refueledAt"
        type="datetime-local"
        defaultValue={todayLocalISO()}
        required
      />

      {error && <p className="text-sm text-red-600">{error}</p>}
      {ok && <p className="text-sm text-green-600">Repostaje guardado ✓</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {loading ? "Guardando..." : "Guardar repostaje"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <input
        name={name}
        type={type}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
        {...rest}
      />
    </label>
  );
}
