import { PlanDef, UseCases } from "../types.js";
import { PRICING_DATA } from "./pricingData.js";

export function findPlan(toolName: string, planName: string): PlanDef | undefined {
  return PRICING_DATA[toolName]?.plans.find(
    (p) => p.name.toLowerCase() === planName.toLowerCase()
  );
}

export function findCheaperPlan(
  toolName: string,
  useCases: UseCases,
  currentPlan: PlanDef,
  seats: number
): PlanDef | null {
  const toolDef = PRICING_DATA[toolName];
  if (!toolDef) return null;

  const options = toolDef.plans.filter((p) => {
    const cheaper = p.pricePerSeat < currentPlan.pricePerSeat;
    const isPaid = p.pricePerSeat > 0;
    const noCustomPricing = !p.customPricing;
    const compatible =
      (!p.minSeats || p.minSeats <= seats) &&
      (!p.maxSeats || p.maxSeats >= seats);
    const useCaseFit =
      p.useCases.includes(useCases) || p.useCases.includes("mixed");

    return cheaper && isPaid && noCustomPricing && compatible && useCaseFit;
  });

  if (options.length === 0) return null;

  return options.sort((a, b) => a.pricePerSeat - b.pricePerSeat)[0];
}

export function findUpgradePlan(
  toolName: string,
  useCases: UseCases,
  currentPlan: PlanDef,
  seats: number
): PlanDef | null {
  const toolDef = PRICING_DATA[toolName];
  if (!toolDef) return null;

  const options = toolDef.plans.filter((p) => {
    const moreExpensive = p.pricePerSeat > currentPlan.pricePerSeat;
    const noCustomPricing = !p.customPricing;
    const compatible =
      (!p.minSeats || p.minSeats <= seats) &&
      (!p.maxSeats || p.maxSeats >= seats);
    const useCaseFit =
      p.useCases.includes(useCases) || p.useCases.includes("mixed");

    return moreExpensive && noCustomPricing && compatible && useCaseFit;
  });

  if (options.length === 0) return null;

  return options.sort((a, b) => a.pricePerSeat - b.pricePerSeat)[0];
}

export function findFreePlan(
  toolName: string,
  useCases: UseCases,
  seats: number
): PlanDef | null {
  const toolDef = PRICING_DATA[toolName];
  if (!toolDef) return null;

  const options = toolDef.plans.filter((p) => {
    const isFree = p.pricePerSeat === 0 && !p.customPricing;
    const compatible =
      (!p.minSeats || p.minSeats <= seats) &&
      (!p.maxSeats || p.maxSeats >= seats);
    const useCaseFit =
      p.useCases.includes(useCases) || p.useCases.includes("mixed");

    return isFree && compatible && useCaseFit;
  });

  return options[0] || null;
}
