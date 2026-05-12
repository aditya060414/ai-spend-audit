import nodemailer from "nodemailer";
import { isValidEmail, getSubjectLine } from "./emailHelpers.js";
import { buildEmailHTML } from "./buildEmailHTML.js";

export interface SendAuditEmailParams {
  to: string;
  shareId: string;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  isHighValue: boolean;
}

// Create transporter using SMTP settings
const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST || "smtp-relay.brevo.com",
  port: Number(process.env.BREVO_SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
});

export async function sendAuditEmail(
  params: SendAuditEmailParams
): Promise<boolean> {
  if (!process.env.BREVO_SMTP_USER || !process.env.BREVO_SMTP_PASS) {
    console.warn("Brevo SMTP credentials not set (BREVO_SMTP_USER/PASS) — skipping email send");
    return false;
  }

  if (!isValidEmail(params.to)) {
    console.warn(`Invalid email address: ${params.to}`);
    return false;
  }

  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const reportUrl = `${clientUrl}/report/${params.shareId}`;
  
  // The sender must be a verified sender in Brevo
  const fromEmail = process.env.FROM_EMAIL || "singh.aditya.44618@gmail.com";

  try {
    await transporter.sendMail({
      from: fromEmail,
      to: params.to,
      subject: getSubjectLine(params.totalMonthlySavings),
      html: buildEmailHTML(params),
      text: `
AI Spend Audit Results

Potential monthly savings:
$${params.totalMonthlySavings}/month

Potential annual savings:
$${params.totalAnnualSavings}/year

View full report:
${reportUrl}
      `,
    });

    console.log(`Email sent successfully via SMTP to ${params.to}`);
    return true;
  } catch (error: unknown) {
    console.error("SMTP email error:", error);
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Email send failed: ${message}`);
    return false;
  }
}
