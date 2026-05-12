import { ToolDef } from "../types.js";

export const PRICING_DATA: Record<string, ToolDef> = {
  Cursor: {
    plans: [
      { name: "Hobby", pricePerSeat: 0, useCases: ["coding"], maxSeats: 1 },
      { name: "Pro", pricePerSeat: 20, useCases: ["coding"] },
      { name: "Business", pricePerSeat: 40, useCases: ["coding"] },
    ],
  },

  "GitHub Copilot": {
    plans: [
      { name: "Free", pricePerSeat: 0, useCases: ["coding"], maxSeats: 1 },
      { name: "Pro", pricePerSeat: 10, useCases: ["coding"], maxSeats: 1 },
      { name: "Pro+", pricePerSeat: 39, useCases: ["coding"], maxSeats: 1 },
      { name: "Business", pricePerSeat: 19, useCases: ["coding"] },
      { name: "Enterprise", pricePerSeat: 39, useCases: ["coding"] },
    ],
  },

  Claude: {
    plans: [
      { name: "Free", pricePerSeat: 0, useCases: ["writing", "research", "mixed"], maxSeats: 1 },
      { name: "Pro", pricePerSeat: 20, useCases: ["writing", "research", "mixed", "coding", "data", "learning"] },
      { name: "Max", pricePerSeat: 100, useCases: ["writing", "research", "mixed", "coding", "data", "learning"] },
      { name: "Team", pricePerSeat: 25, minSeats: 5, useCases: ["writing", "research", "mixed"] },
      { name: "Enterprise", pricePerSeat: 0, customPricing: true, useCases: ["writing", "research", "mixed"] },
    ],
  },

  ChatGPT: {
    plans: [
      { name: "Free", pricePerSeat: 0, useCases: ["writing", "research", "mixed"], maxSeats: 1 },
      { name: "Go", pricePerSeat: 5, useCases: ["writing", "research", "mixed"], maxSeats: 1 },
      { name: "Plus", pricePerSeat: 20, maxSeats: 1, useCases: ["writing", "research", "mixed", "coding", "data", "learning"] },
      { name: "Pro", pricePerSeat: 200, maxSeats: 1, useCases: ["writing", "research", "mixed", "coding", "data", "learning"] },
      { name: "Business", pricePerSeat: 26, minSeats: 2, useCases: ["writing", "research", "mixed", "coding", "data", "learning"] },
      { name: "Enterprise", pricePerSeat: 0, customPricing: true, useCases: ["writing", "research", "mixed", "coding", "data", "learning"] },
    ],
  },

  Windsurf: {
    plans: [
      { name: "Free", pricePerSeat: 0, useCases: ["coding"], maxSeats: 1 },
      { name: "Pro", pricePerSeat: 20, useCases: ["coding"] },
      { name: "Max", pricePerSeat: 200, useCases: ["coding"] },
      { name: "Team", pricePerSeat: 40, useCases: ["coding"] },
      { name: "Enterprise", pricePerSeat: 0, customPricing: true, useCases: ["coding"] },
    ],
  },

  Gemini: {
    plans: [
      { name: "Free", pricePerSeat: 0, useCases: ["research", "writing", "mixed"] },
      { name: "Google AI Pro", pricePerSeat: 20, useCases: ["coding", "writing", "research", "mixed", "data", "learning"] },
      { name: "Google AI Ultra", pricePerSeat: 250, useCases: ["coding", "research", "mixed", "data"] },
    ],
  },

  "Anthropic API": {
    plans: [
      { name: "Build", pricePerSeat: 0, useCases: ["coding", "writing", "research", "mixed", "data", "learning"] },
      { name: "Scale", pricePerSeat: 0, customPricing: true, useCases: ["coding", "writing", "research", "mixed", "data", "learning"] },
    ],
  },

  "OpenAI API": {
    plans: [
      { name: "Free", pricePerSeat: 0, useCases: ["coding", "writing", "research", "mixed", "data", "learning"] },
      { name: "Pay-as-you-go", pricePerSeat: 0, customPricing: true, useCases: ["coding", "writing", "research", "mixed", "data", "learning"] },
    ],
  },

  "Gemini API": {
    plans: [
      { name: "Free", pricePerSeat: 0, useCases: ["coding", "research", "mixed", "data", "learning"] },
      { name: "Pay-as-you-go", pricePerSeat: 0, customPricing: true, useCases: ["coding", "research", "mixed", "data", "learning"] },
    ],
  },
};
