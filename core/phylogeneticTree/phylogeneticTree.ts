export function getEvolutionaryDistance(alignedA: string, alignedB: string) {
  let differences = 0;
  let totalValidSites = 0;

  // p-distance is a straightforward distance between two sequences
  // calculated by dividing differences to the totalValidSites
  // ignoring the gaps

  for (let i = 0; i < alignedA.length; i++) {
    const charA = alignedA[i];
    const charB = alignedB[i];

    if (charA !== "-" && charB !== "-") {
      totalValidSites++;
      if (charA !== charB) {
        differences++;
      }
    }
  }

  if (totalValidSites === 0) return 0;

  const p = differences / totalValidSites;

  // Apply Protein Jukes-Cantor Correction
  // This correction takes historical errors into account
  // A mutation from L to A, then A to L again
  // is considered no mutation while calculated with p distance only
  // Jukes-Cantor correction is used to avoid this small calculation error.
  // Formula: d = -19/20 * ln(1 - 20/19 * p)
  const constant = 19 / 20;
  const correctionTerm = 1 - p / constant;

  // if p >= 0.95, the sequences are too distant for this model
  if (correctionTerm <= 0) {
    console.warn("Sequences are too divergent for Jukes-Cantor!");
    return Infinity;
  }

  const d = -constant * Math.log(correctionTerm);

  return {
    pDistance: p,
    jukesCantorDistance: d,
    totalValidSites,
  };
}
