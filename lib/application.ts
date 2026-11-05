import { z } from "zod";
export const roles = [
  "Owner / founder",
  "Partner / co-owner",
  "President / operating leader",
  "Other",
] as const;
export const revenues = [
  "Under $500k",
  "$500k–$1m",
  "$1m–$3m",
  "$3m–$5m",
  "$5m–$10m",
  "$10m+",
] as const;
export const teams = ["1–4", "5–9", "10–19", "20–49", "50–99", "100+"] as const;
export const serviceOptions = [
  "Boundary / residential",
  "ALTA / commercial",
  "Construction staking",
  "Topographic / land development",
  "Mapping / LiDAR / UAV",
  "Other",
] as const;
export const sharingOptions = [
  "Yes, under confidentiality",
  "Open to learning more",
  "Not at this stage",
] as const;
export const stateCodes =
  "AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY".split(
    " ",
  );
export const statuses = {
  received: "Received",
  reviewing: "Reviewing",
  call_invited: "Call invited",
  waiting_for_match: "Waiting for a match",
  invited: "Membership offered",
  closed: "Closed",
} as const;
export const applicationSchema = z.object({
  submissionKey: z.string().uuid(),
  fullName: z.string().trim().min(2, "Please enter your full name.").max(100),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email.")
    .max(254)
    .transform((v) => v.toLowerCase()),
  phone: z.string().trim().max(40).default(""),
  role: z.enum(roles),
  company: z.string().trim().min(2, "Please enter your company name.").max(160),
  website: z
    .string()
    .trim()
    .max(250)
    .default("")
    .refine(
      (v) => !v || (/^https?:\/\//i.test(v) && !/[\s<>]/.test(v)),
      "Use a full website address beginning with https://.",
    ),
  city: z.string().trim().min(2, "Please enter your city.").max(100),
  state: z
    .string()
    .refine((v) => stateCodes.includes(v), "Please select your state."),
  serviceArea: z
    .string()
    .trim()
    .min(2, "Please describe your service area.")
    .max(300),
  revenue: z.enum(revenues),
  team: z.enum(teams),
  services: z
    .array(z.enum(serviceOptions))
    .min(1, "Select at least one service.")
    .max(6),
  challenge: z
    .string()
    .trim()
    .min(10, "Tell us a little more about your main business question.")
    .max(1500),
  sharing: z.enum(sharingOptions),
  consent: z.literal(true),
  source: z.string().max(500).default(""),
  fax: z.string().max(200).default(""),
});
export type ApplicationInput = z.infer<typeof applicationSchema>;
export type ApplicationRow = {
  id: string;
  createdAt: number;
  updatedAt: number;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  company: string;
  website: string;
  city: string;
  state: string;
  serviceArea: string;
  revenue: string;
  team: string;
  services: string;
  challenge: string;
  sharing: string;
  status: string;
  notes: string;
  source: string;
};
export function csvCell(value: unknown) {
  let text = String(value ?? "");
  if (/^[\s]*[=+@-]/.test(text)) text = "'" + text;
  return '"' + text.replaceAll('"', '""') + '"';
}
