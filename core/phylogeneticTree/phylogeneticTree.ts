import { gotoh, GotohParameters } from "../sequenceAlignment/gotohAlgorithm";

function getEvolutionaryDistance(
  alignedA: string,
  alignedB: string,
): { pDistance: number; jukesCantorDistance: number; totalValidSites: number } {
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

  if (totalValidSites === 0)
    return {
      pDistance: 0,
      jukesCantorDistance: 0,
      totalValidSites: 0,
    };

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
    return {
      pDistance: p,
      jukesCantorDistance: Infinity,
      totalValidSites,
    };
  }

  const d = -constant * Math.log(correctionTerm);

  return {
    pDistance: p,
    jukesCantorDistance: d,
    totalValidSites,
  };
}

export interface DistanceMatrixEntity {
  name: string;
  sequence: string;
}

export function buildDistanceMatrix(
  entities: DistanceMatrixEntity[],
  params: GotohParameters,
) {
  const size = entities.length;

  // Initialize a square matrix filled with 0s
  const matrix: number[][] = Array.from({ length: size }, () =>
    Array(size).fill(0),
  );

  for (let i = 0; i < size; i++) {
    // Start 'j' at 'i + 1' to skip the diagonal (i == j)
    // and the already calculated lower triangle
    for (let j = i + 1; j < size; j++) {
      const { alignedA, alignedB } = gotoh(
        entities[i].sequence,
        entities[j].sequence,
        params,
      );

      const { jukesCantorDistance } = getEvolutionaryDistance(
        alignedA,
        alignedB,
      );

      // Fill both symmetric spots with the same result
      matrix[i][j] = jukesCantorDistance;
      matrix[j][i] = jukesCantorDistance;
    }
  }

  return matrix;
}
