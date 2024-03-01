export function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Checks the likelihood of something happening
 *
 * @param percentChance - The chances of something happening (can be either decimal or whole number)
 * @returns Whether the event has occurred
 */
export function chanceOfEvent(percentChance: number): boolean {
  if (percentChance < 1) {
    percentChance *= 100;
  }
  return percentChance >= randomNumber(1, 100);
}
