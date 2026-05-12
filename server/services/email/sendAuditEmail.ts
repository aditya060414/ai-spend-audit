import { Resend } from "resend";
import { isValidEmail, getSubjectLine } from "./emailHelpers.js";
import { buildEmailHTML } from "./buildEmailHTML.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendAuditEmailParams {
  to: string;
  shareId: string;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  isHighValue: boolean;
}

export async function sendAuditEmail(params: SendAuditEmailParams): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — skipping email send");
    return false;
  }

  if (!isValidEmail(params.to)) {
    console.warn(`Invalid email address: ${params.to}`);
    return false;
  }

  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const reportUrl = `${clientUrl}/report/${params.shareId}`;

  try {
    await resend.emails.send({
      from: process.env.FROM_EMAIL || "onboarding@resend.dev",
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

    return true;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Email send failed: ${message}`);
    return false;
  }
}
