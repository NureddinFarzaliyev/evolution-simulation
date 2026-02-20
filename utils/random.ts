export function generateRandomInteger(
  min: number,
  max: number,
  exclude?: number[],
): number {
  let r: number;

  do {
    r = Math.floor(Math.random() * (max - min + 1)) + min;
  } while (exclude?.includes(r));

  return r;
}

export function checkByPercentage(percentage: number): boolean {
  if (percentage === 0) return false;
  const random = generateRandomInteger(1, 100);
  return random <= percentage;
}
