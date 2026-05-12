import { getAuditEmailHTML, EmailTemplateParams } from "./templates/auditTemplate.js";

export function buildEmailHTML(params: Omit<EmailTemplateParams, "clientUrl">): string {
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  return getAuditEmailHTML({ ...params, clientUrl });
}
