import { Router, Request, Response } from "express";
import { nanoid } from "nanoid";
import { AuditInputSchema } from "../middlewares/auditValidator.js";
import { runAuditEngine } from "../services/auditEngine.js";
import { Report } from "../models/Report.js";
import { auditLimiter } from "../middlewares/rateLimiter.js";
import z from "zod";
import { generateAISummary } from "../services/openAIServices.js";
const router = Router();

router.post("/", auditLimiter, async (req: Request, res: Response) => {
  const parsed = AuditInputSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid input.",
      details: z.flattenError(parsed.error),
    });
  }
  const input = parsed.data;

  const auditResults = runAuditEngine(input);

  const { summary: aiSummary, wasFallback: summaryWasFallback } =
    await generateAISummary(input, auditResults);

  const shareId = nanoid(10);
  try {
    await Report.create({
      shareId,
      inputs: input,
      auditResults,
      aiSummary,
      summaryWasFallback,
      isLeadCaptured: false,
    });

    return res.status(200).json({
      shareId,
      auditResults,
      aiSummary,
      summaryWasFallback,
    });
  } catch (error) {
    console.error("Failed to save report:", error);
    return res.status(500).json({ error: "Failed to save audit report." });
  }
});

/*
function generateFallbackSummary(
  input: { teamSize: number; useCases: string; tools: { toolName: string }[] },
  results: {
    totalMonthlySavings: number;
    totalAnnualSavings: number;
    savingsCategory: string;
  },
): string {
  const toolList = input.tools.map((t) => t.toolName).join(", ");

  if (results.savingsCategory === "optimal") {
    return `Your team of ${input.teamSize} is spending efficiently across ${toolList}. No immediate optimizations found — you're already well-positioned for your ${input.useCases} workflows.`;
  }

  return `Your team of ${input.teamSize} is currently using ${toolList} for ${input.useCases} work. Based on your current plans and seat counts, you could save $${results.totalMonthlySavings}/month ($${results.totalAnnualSavings}/year) by following the recommendations below.`;
}
*/
export default router;
