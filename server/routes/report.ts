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

    return res.status(200).json({
      shareId: report.shareId,
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
