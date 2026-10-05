import {
  boolean,
  date,
  index,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const appointments = pgTable(
  "appointments",
  {
    id: serial("id").primaryKey(),
    reference: varchar("reference", { length: 16 }).notNull().unique(),
    treatment: text("treatment").notNull(),
    date: date("date", { mode: "string" }).notNull(),
    time: varchar("time", { length: 5 }).notNull(),
    name: text("name").notNull(),
    phone: varchar("phone", { length: 20 }).notNull(),
    email: text("email"),
    firstVisit: boolean("first_visit").notNull().default(true),
    notes: text("notes"),
    status: varchar("status", { length: 16 }).notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("appointments_date_idx").on(t.date)],
);

export type Appointment = typeof appointments.$inferSelect;
