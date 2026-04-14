import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { getRefuelsWithDelta } from "@/lib/queries";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const month = url.searchParams.get("month"); // formato YYYY-MM

  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json(
      { error: "Parámetro 'month' obligatorio en formato YYYY-MM" },
      { status: 400 },
    );
  }

  const [yearStr, monthStr] = month.split("-");
  const year = Number(yearStr);
  const m = Number(monthStr);
  const from = new Date(Date.UTC(year, m - 1, 1));
  const to = new Date(Date.UTC(year, m, 1));

  const rows = await getRefuelsWithDelta({ from, to });

  const wb = new ExcelJS.Workbook();
  wb.creator = "Repostajes";
  wb.created = new Date();
  const ws = wb.addWorksheet(`Repostajes ${month}`);

  ws.columns = [
    { header: "Fecha", key: "fecha", width: 18 },
    { header: "Empleado", key: "empleado", width: 25 },
    { header: "Matrícula", key: "matricula", width: 12 },
    { header: "Gasolinera", key: "gasolinera", width: 28 },
    { header: "Litros", key: "litros", width: 10 },
    { header: "Importe (€)", key: "importe", width: 12 },
    { header: "Km vehículo", key: "km", width: 14 },
    { header: "Km desde anterior", key: "kmDelta", width: 18 },
  ];

  ws.getRow(1).font = { bold: true };
  ws.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFE2E8F0" },
  };

  for (const r of rows) {
    ws.addRow({
      fecha: r.refueledAt,
      empleado: r.employeeName,
      matricula: r.plate,
      gasolinera: r.station,
      litros: Number(r.liters),
      importe: Number(r.amount),
      km: r.odometerKm,
      kmDelta: r.kmSincePrevious,
    });
  }

  ws.getColumn("fecha").numFmt = "dd/mm/yyyy hh:mm";
  ws.getColumn("litros").numFmt = "#,##0.00";
  ws.getColumn("importe").numFmt = '#,##0.00 "€"';
  ws.getColumn("km").numFmt = "#,##0";
  ws.getColumn("kmDelta").numFmt = "#,##0";

  ws.autoFilter = { from: "A1", to: "H1" };

  const buffer = await wb.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="repostajes-${month}.xlsx"`,
      "Cache-Control": "no-store",
    },
  });
}
