import { pgTable, serial, text, integer, numeric, timestamp } from "drizzle-orm/pg-core";

export const refuels = pgTable("refuels", {
  id: serial("id").primaryKey(),
  employeeName: text("employee_name").notNull(),
  plate: text("plate").notNull(),
  station: text("station").notNull(),
  liters: numeric("liters", { precision: 10, scale: 2 }).notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  odometerKm: integer("odometer_km").notNull(),
  refueledAt: timestamp("refueled_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Refuel = typeof refuels.$inferSelect;
export type NewRefuel = typeof refuels.$inferInsert;
