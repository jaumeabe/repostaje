import { getRefuelsWithDelta } from "@/lib/queries";

export const dynamic = "force-dynamic";

const fmtDate = new Intl.DateTimeFormat("es-ES", {
  dateStyle: "short",
  timeStyle: "short",
});
const fmtEur = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });
const fmtNum = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 2 });

export default async function RepostajesPage() {
  const rows = await getRefuelsWithDelta({});

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Histórico de repostajes</h1>

      {rows.length === 0 ? (
        <p className="text-slate-600">Todavía no hay repostajes registrados.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <Th>Fecha</Th>
                <Th>Empleado</Th>
                <Th>Matrícula</Th>
                <Th>Gasolinera</Th>
                <Th className="text-right">Litros</Th>
                <Th className="text-right">Importe</Th>
                <Th className="text-right">Km vehículo</Th>
                <Th className="text-right">Km desde anterior</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <Td>{fmtDate.format(r.refueledAt)}</Td>
                  <Td>{r.employeeName}</Td>
                  <Td className="font-mono">{r.plate}</Td>
                  <Td>{r.station}</Td>
                  <Td className="text-right">{fmtNum.format(Number(r.liters))}</Td>
                  <Td className="text-right">{fmtEur.format(Number(r.amount))}</Td>
                  <Td className="text-right">{fmtNum.format(r.odometerKm)}</Td>
                  <Td className="text-right">
                    {r.kmSincePrevious == null ? "—" : fmtNum.format(r.kmSincePrevious)}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-3 py-2 font-semibold ${className}`}>{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-3 py-2 ${className}`}>{children}</td>;
}
