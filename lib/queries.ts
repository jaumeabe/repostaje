import { sql } from "drizzle-orm";
import { db } from "./db";

export type RefuelRow = {
  id: number;
  employeeName: string;
  plate: string;
  station: string;
  liters: string;
  amount: string;
  odometerKm: number;
  refueledAt: Date;
  kmSincePrevious: number | null;
};

/**
 * Trae repostajes dentro de un rango, con los km recorridos desde el repostaje
 * anterior de la MISMA matrícula (calculado con LAG).
 */
export async function getRefuelsWithDelta(params: {
  from?: Date;
  to?: Date;
}): Promise<RefuelRow[]> {
  const { from, to } = params;

  const rows = await db.execute<{
    id: number;
    employee_name: string;
    plate: string;
    station: string;
    liters: string;
    amount: string;
    odometer_km: number;
    refueled_at: Date;
    km_since_previous: number | null;
  }>(sql`
    SELECT
      id,
      employee_name,
      plate,
      station,
      liters,
      amount,
      odometer_km,
      refueled_at,
      odometer_km - LAG(odometer_km) OVER (PARTITION BY plate ORDER BY refueled_at)
        AS km_since_previous
    FROM refuels
    ${from && to ? sql`WHERE refueled_at >= ${from} AND refueled_at < ${to}` : sql``}
    ORDER BY refueled_at DESC
  `);

  // drizzle neon-http devuelve { rows } o array según versión
  const list = Array.isArray(rows) ? rows : (rows as unknown as { rows: typeof rows }).rows;

  return list.map((r) => ({
    id: r.id,
    employeeName: r.employee_name,
    plate: r.plate,
    station: r.station,
    liters: r.liters,
    amount: r.amount,
    odometerKm: r.odometer_km,
    refueledAt: new Date(r.refueled_at),
    kmSincePrevious: r.km_since_previous,
  }));
}
