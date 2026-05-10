import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// SCHEMA
interface SendAuditEmailParams {
  to: string;
  shareId: string;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  isHighValue: boolean;
}

// HELPERS

// Check email is valid
function isValidEmail(email: string): boolean {
  return /^\S+@\S+\.\S+$/.test(email);
}

// email subject
function getSubjectLine(monthlySavings: number): string {
  if (monthlySavings >= 500) {
    return `Potential AI savings identified: ` + `$${monthlySavings}/month`;
  }

  if (monthlySavings > 0) {
    return "Your AI spend audit results are ready";
  }

  return "Your AI spend audit — your stack looks optimized";
}

// email template
function buildEmailHTML(params: SendAuditEmailParams): string {
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

  const reportUrl = `${clientUrl}/report/${params.shareId}`;

  const optimizationSection = params.isHighValue
    ? `
        <div
          style="
            background:#f0fdf4;
            border:1px solid #86efac;
            border-radius:8px;
            padding:16px;
            margin:24px 0;
          "
        >
          <p
            style="
              margin:0;
              font-weight:600;
              color:#15803d;
            "
          >
            💡 Significant optimization opportunity detected
          </p>

          <p
            style="
              margin:8px 0 0;
              color:#166534;
              font-size:14px;
              line-height:1.5;
            "
          >
            Your current AI SaaS stack may contain
            substantial savings opportunities based
            on overlapping tooling and plan sizing.
          </p>
        </div>
      `
    : "";

  return `
    <!DOCTYPE html>

    <html>

    <head>
      <meta charset="utf-8" />

      <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
      />
    </head>

    <body
      style="
        font-family:system-ui,sans-serif;
        max-width:600px;
        margin:0 auto;
        padding:24px;
        color:#111;
        line-height:1.5;
      "
    >

      <h1
        style="
          font-size:24px;
          font-weight:700;
          margin-bottom:4px;
        "
      >
        Your AI Spend Audit
      </h1>

      <p
        style="
          color:#6b7280;
          margin-top:0;
        "
      >
        Here are your audit results.
      </p>

      <div
        style="
          background:#f9fafb;
          border-radius:8px;
          padding:24px;
          margin:24px 0;
        "
      >

        <p
          style="
            margin:0;
            font-size:14px;
            color:#6b7280;
          "
        >
          Potential monthly savings
        </p>

        <p
          style="
            margin:4px 0 0;
            font-size:36px;
            font-weight:700;
            color:#16a34a;
          "
        >
          $${params.totalMonthlySavings}/mo
        </p>

        <p
          style="
            margin:4px 0 0;
            font-size:14px;
            color:#6b7280;
          "
        >
          $${params.totalAnnualSavings}/year
        </p>

      </div>

      ${optimizationSection}

      <a
        href="${reportUrl}"
        style="
          display:inline-block;
          background:#111;
          color:#fff;
          padding:12px 24px;
          border-radius:6px;
          text-decoration:none;
          font-weight:600;
          margin-top:8px;
        "
      >
        View Full Report →
      </a>

      <p
        style="
          margin-top:32px;
          font-size:12px;
          color:#9ca3af;
          word-break:break-all;
        "
      >
        Shareable report link:
        ${reportUrl}
      </p>

    </body>

    </html>
  `;
}

// MAIN 
export async function sendAuditEmail(
  params: SendAuditEmailParams,
): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — skipping email send");

    return false;
  }

  // Runtime email validation
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
    // break lead capture flow
    const message = error instanceof Error ? error.message : String(error);

    console.error(`Email send failed: ${message}`);

    return false;
  }
}
