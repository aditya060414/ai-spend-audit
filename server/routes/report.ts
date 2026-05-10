import { Router, Request, Response } from "express";
import { Report } from "../models/Report.js";

const router = Router();

router.get("/:shareId", async (req: Request, res: Response) => {
  const shareId = String(req.params.shareId);

  // validation
  if (!/^[a-zA-Z0-9_-]{8,24}$/.test(shareId)) {
    return res.status(400).json({ error: "Invalid report ID format." });
  }

  try {
    const report = await Report.findOne({ shareId }).lean();

    if (!report) {
      console.warn(`Report not found for shareId: ${shareId}`);
      return res.status(404).json({ error: "Report not found." });
    }


    return res.status(200).json({
      shareId: report.shareId,
      isGated: false, // for future can add a section to buy subscription to get full review
      inputs: report.inputs,
      auditResults: report.auditResults,
      aiSummary: report.aiSummary,
      summaryWasFallback: report.summaryWasFallback,
      isLeadCaptured: report.isLeadCaptured
    });
  } catch (err) {
    console.error("Failed to fetch report:", err);
    return res.status(500).json({ error: "Failed to fetch report." });
  }
});

export default router;
