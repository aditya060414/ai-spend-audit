export function isValidEmail(email: string): boolean {
  return /^\S+@\S+\.\S+$/.test(email);
}

export function getSubjectLine(monthlySavings: number): string {
  if (monthlySavings >= 500) {
    return `Potential AI savings identified: $${monthlySavings}/month`;
  }

  if (monthlySavings > 0) {
    return "Your AI spend audit results are ready";
  }

  return "Your AI spend audit — your stack looks optimized";
}
