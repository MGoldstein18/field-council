import { pgTable, text, integer, bigint, index } from "drizzle-orm/pg-core";
export const applications = pgTable(
  "applications",
  {
    id: text("id").primaryKey(),
    submissionKey: text("submission_key").notNull().unique(),
    createdAt: bigint("created_at", { mode: "number" }).notNull(),
    updatedAt: bigint("updated_at", { mode: "number" }).notNull(),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull().default(""),
    role: text("role").notNull(),
    company: text("company").notNull(),
    website: text("website").notNull().default(""),
    city: text("city").notNull(),
    state: text("state").notNull(),
    serviceArea: text("service_area").notNull(),
    revenue: text("revenue").notNull(),
    team: text("team").notNull(),
    services: text("services").notNull(),
    challenge: text("challenge").notNull(),
    sharing: text("sharing").notNull(),
    consentVersion: text("consent_version").notNull(),
    source: text("source").notNull().default(""),
    status: text("status").notNull().default("received"),
    notes: text("notes").notNull().default(""),
  },
  (t) => [
    index("applications_created_idx").on(t.createdAt),
    index("applications_status_idx").on(t.status),
  ],
);
export const requestLimits = pgTable(
  "request_limits",
  {
    key: text("key").primaryKey(),
    count: integer("count").notNull().default(1),
    createdAt: bigint("created_at", { mode: "number" }).notNull(),
  },
  (t) => [index("request_limits_created_idx").on(t.createdAt)],
);
