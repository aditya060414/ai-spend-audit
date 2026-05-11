import { Router, Request, Response } from "express";
import { LeadInputSchema } from "../middlewares/auditValidator.js";
import { Lead } from "../models/Lead.js";
import { Report } from "../models/Report.js";
import { leadLimiter } from "../middlewares/rateLimiter.js";
import { sendAuditEmail } from "../services/emailService.js";

const router = Router();

router.post("/", leadLimiter, async (req: Request, res: Response) => {
  const parsed = LeadInputSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid input",
      details: parsed.error.flatten(),
    });
  }

  const { shareId, email, companyName, role, website } = parsed.data;

  if (website) {
    return res.status(200).json({ success: true });
  }

  const report = await Report.findOne({ shareId }).lean();

  if (!report) {
    return res.status(404).json({ error: "Report not found." });
  }

  const existing = await Lead.findOne({ shareId, email });

  if (existing) {
    return res.status(200).json({ success: true });
  }

  const totalMonthlySavings = report.auditResults.totalMonthlySavings;
  const isHighValue = totalMonthlySavings > 500;

  let emailSent: boolean;

  try {
    await Lead.create({
      shareId,
      email,
      companyName,
      role,
      totalMonthlySavings,
      isHighValue,
      emailSent: false,
    });

    await Report.updateOne({ shareId }, { isLeadCaptured: true });
    emailSent = await sendAuditEmail({
      to: email,
      shareId,
      totalMonthlySavings,
      totalAnnualSavings: report.auditResults.totalAnnualSavings,
      isHighValue,
    });

    // Update emailSent flag if it worked
    if (emailSent) {
      await Lead.updateOne({ shareId, email }, { emailSent: true });
    }
    return res.status(201).json({
      success: true,
      isHighValue,
    });
  } catch (err) {
    console.error("Failed to save lead:", err);
    return res.status(500).json({ error: "Failed to capture lead." });
  }
});

export default router;
