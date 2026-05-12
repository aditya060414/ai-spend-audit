export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(0)}%`;
}

export function sanitizeToolName(name: string): string {
  return name.trim();
}
