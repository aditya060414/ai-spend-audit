export function calculateProjectedCost(pricePerSeat: number, seats: number): number {
  return pricePerSeat * seats;
}

export function isSeatLimitExceeded(currentSeats: number, maxSeats?: number): boolean {
  if (!maxSeats) return false;
  return currentSeats > maxSeats;
}
