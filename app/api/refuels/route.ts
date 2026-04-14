import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { refuels } from "@/lib/schema";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const employeeName = String(b.employeeName ?? "").trim();
  const plate = String(b.plate ?? "").trim().toUpperCase();
  const station = String(b.station ?? "").trim();
  const liters = Number(b.liters);
  const amount = Number(b.amount);
  const odometerKm = Number(b.odometerKm);
  const refueledAtRaw = String(b.refueledAt ?? "");

  if (!employeeName || !plate || !station) {
    return NextResponse.json({ error: "Empleado, matrícula y gasolinera son obligatorios" }, { status: 400 });
  }
  if (!Number.isFinite(liters) || liters <= 0) {
    return NextResponse.json({ error: "Litros inválidos" }, { status: 400 });
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: "Importe inválido" }, { status: 400 });
  }
  if (!Number.isInteger(odometerKm) || odometerKm < 0) {
    return NextResponse.json({ error: "Kilómetros inválidos" }, { status: 400 });
  }
  const refueledAt = new Date(refueledAtRaw);
  if (isNaN(refueledAt.getTime())) {
    return NextResponse.json({ error: "Fecha inválida" }, { status: 400 });
  }

  const [row] = await db
    .insert(refuels)
    .values({
      employeeName,
      plate,
      station,
      liters: liters.toFixed(2),
      amount: amount.toFixed(2),
      odometerKm,
      refueledAt,
    })
    .returning();

  return NextResponse.json({ ok: true, id: row.id });
}
