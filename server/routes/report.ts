import { Router, Request, Response } from "express";
import { Report } from "../models/Report.js";

const router = Router();

router.get("/:shareId", async (req: Request, res: Response) => {
  const shareId = String(req.params.shareId);

  if (!/^[a-zA-Z0-9_-]{10}$/.test(shareId)) {
    return res.status(400).json({ error: "Invalid report ID format." });
  }

  try {
    const report = await Report.findOne({ shareId }).lean();

    if (!report) {
      return res.status(404).json({ error: "Report not found." });
    }

    // Gating Logic: 
    // If a lead hasn't been captured for this report, we only return the high-level totals
    // to protect the detailed AI analysis and tool-by-tool breakdown.
    if (!report.isLeadCaptured) {
      return res.status(200).json({
        shareId: report.shareId,
        isGated: true,
        inputs: {
          teamSize: report.inputs.teamSize,
          useCases: report.inputs.useCases,
          // We return tool names for charts, but no financial details per tool
          tools: report.inputs.tools.map(t => ({ toolName: t.toolName }))
        },
        auditResults: {
          totalMonthlySavings: report.auditResults.totalMonthlySavings,
          totalAnnualSavings: report.auditResults.totalAnnualSavings,
          savingsCategory: report.auditResults.savingsCategory,
          // Limited tool info for the "blurred" charts
          perTool: report.auditResults.perTool.map(t => ({ 
            toolName: t.toolName,
            currentMonthlySpending: t.currentMonthlySpending,
            monthlySavings: t.monthlySavings
          }))
        },
        // No AI summary or detailed reasons in gated mode
        aiSummary: "Submit your details to unlock full AI financial analysis and optimization reasons.",
      });
    }

    // Full response for captured leads
    return res.status(200).json({
      shareId: report.shareId,
      isGated: false,
      inputs: report.inputs,
      auditResults: report.auditResults,
      aiSummary: report.aiSummary,
    });
  } catch (err) {
    console.error("Failed to fetch report:", err);
    return res.status(500).json({ error: "Failed to fetch report." });
  }
});

export default router;
