import { SavingsCategory } from "./types.js";

export function getSavingsCategory(monthly: number): SavingsCategory {
  if (monthly <= 0) return "optimal";
  else if (monthly <= 100) return "low";
  else if (monthly <= 200) return "medium";
  else if (monthly <= 500) return "high";
  else return "critical";
}
