import { z } from "zod";

export const ToolInputSchema = z.object({
  toolName: z.string().min(1),
  currentPlan: z.string().min(1),
  seats: z.number().int().min(1).max(10000),
  monthlyCost: z.number().min(0).max(1000000),
});

export const AuditInputSchema = z.object({
  teamSize: z.number().int().min(1).max(100000),
  useCases: z.enum(["coding", "writing", "data", "research", "mixed"]),
  tools: z.array(ToolInputSchema).min(1).max(20),
});

export const LeadInputSchema = z.object({
  shareId: z.string().min(1),
  email: z.string().email(),
  companyName: z.string().optional(),
  role: z.string().optional(),
  website: z.string().optional(), // keep the website from attact this will be hidden using css but see this but humans don't
});

