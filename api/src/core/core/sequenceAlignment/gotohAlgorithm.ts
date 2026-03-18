// In regular smith-waterman algorithm, we use a simple scoring scheme with match, mismatch and gap scores.
// However, in real life, we have more complex scoring schemes like BLOSUM62 or PAM250, which is a substitution matrix used for sequence alignment of proteins. It assigns different scores to different amino acid substitutions based on their observed frequencies in related proteins.
// Also, we need to implement Gotoh's algorithm instead of regular smith-waterman to handle affine gap penalties, which are more realistic for biological sequences. In Gotoh's algorithm, we have separate matrices for gap opening and gap extension, allowing us to penalize the opening of a gap more than the extension of an existing gap.
// While using Gotoh's we don't have to store traceback algorithm as it can be calculated

import BLOSUM62 from "../../data/blosum62.json";
import PAM250 from "../../data/pam250.json";

type MatrixItem = number;
type MatrixRow = MatrixItem[];
type Matrix = MatrixRow[];

type TraceBackCoordinates = {
  i: number;
  j: number;
};
type TraceBackScore = number;

type Input = string;

type Blosum62 = typeof BLOSUM62;
type Pam250 = typeof PAM250;

export interface GotohParameters {
  scoringMatrix: Blosum62 | Pam250;
  gapOpen: number;
  gapExtend: number;
  lambda: number;
  k: number;
}

function generateMatrix(a: Input, b: Input, params: GotohParameters) {
  // matrixM: Best score ending in a match/mismatch (Diagonal)
  // matrixH: Best score ending in a gap in sequence A (Left)
  // matrixV: Best score ending in a gap in sequence B (Top)
  const matrixM: Matrix = [];
  const matrixH: Matrix = [];
  const matrixV: Matrix = [];

  // Scoring Scheme. We do not need match or mismatch anymore. Instead we are gonna use BLOSUM62 or PAM250
  // Instead of using single GAP penalty as in Smith-Waterman,
  // we are going to use seperate penalty values for opening a gap and extending it
  const { gapOpen: GAP_OPEN, gapExtend: GAP_EXTEND, scoringMatrix } = params;

  let maxScore: TraceBackScore = 0;
  let maxCoords: TraceBackCoordinates = { i: 0, j: 0 };

  for (let i = 0; i < a.length + 1; i++) {
    const rowM: MatrixRow = [];
    const rowH: MatrixRow = [];
    const rowV: MatrixRow = [];

    for (let j = 0; j < b.length + 1; j++) {
      if (i == 0 || j == 0) {
        // Smith-Waterman initialization
        // All matrices start at 0.
        rowM.push(0);
        rowH.push(0);
        rowV.push(0);
      } else {
        const aSymbol = a[i - 1];
        const bSymbol = b[j - 1];

        // Calculate vertical gap score (MatrixV)
        // Decide: start a new gap (M + Open)
        // or extend (V + Open)
        const top = Math.max(
          matrixM[i - 1][j] + GAP_OPEN,
          matrixV[i - 1][j] + GAP_EXTEND,
        );
        rowV.push(top);

        // Calculate horizontal gap score (MatrixH)
        // Same logic.
        const left = Math.max(rowM[j - 1] + GAP_OPEN, rowH[j - 1] + GAP_EXTEND);
        rowH.push(left);

        // Instead of using regular match vs mismatch, we are gonna lookup the value from BLOSUM62 or PAM250
        // Calculate Match Score (MatrixM)
        // Find the best from: Diagonal move, Vertical Gap or Horizontal gap
        const diagonal =
          matrixM[i - 1][j - 1] + scoringMatrix[aSymbol][bSymbol];

        // Zero floor
        const add = Math.max(0, top, left, diagonal);
        rowM.push(add);

        // Track global maximum
        if (add > maxScore) {
          maxScore = add;
          maxCoords = { i, j };
        }
      }
    }

    matrixM.push(rowM);
    matrixV.push(rowV);
    matrixH.push(rowH);
  }

  return { matrixM, matrixH, matrixV, maxCoords, maxScore };
}

// Traceback function should be replaced with the one that asks
// "which matrix do I take the value from"
// instead of "which direction"
function traceback(
  matrixM: Matrix,
  matrixH: Matrix,
  matrixV: Matrix,
  maxCoords: TraceBackCoordinates,
  a: Input,
  b: Input,
  params: GotohParameters,
) {
  const { gapExtend: GAP_EXTEND, scoringMatrix } = params;

  let { i: ci, j: cj } = maxCoords;
  let alignedA = "";
  let alignedB = "";

  // Track which layer of the 3D matrix we are in
  // Start with the match matrix, as we find the max score there
  let currentMatrix: "M" | "H" | "V" = "M";

  while (ci > 0 && cj > 0) {
    // if we hit 0 in the Match matrix, local alignment ends

    if (currentMatrix === "M" && matrixM[ci][cj] === 0) break;

    if (currentMatrix === "M") {
      const score = scoringMatrix[a[ci - 1]][b[cj - 1]];

      // Check: Did we get to this Match cell from a previous Match, or by closing a Gap?
      if (
        ci > 0 &&
        cj > 0 &&
        matrixM[ci][cj] === matrixM[ci - 1][cj - 1] + score
      ) {
        alignedA = a[ci - 1] + alignedA;
        alignedB = b[cj - 1] + alignedB;
        ci--;
        cj--;
        currentMatrix = "M";
      } else if (matrixM[ci][cj] === matrixV[ci][cj]) {
        currentMatrix = "V";
      } else if (matrixM[ci][cj] === matrixH[ci][cj]) {
        currentMatrix = "H";
      } else {
        break;
      }
    } else if (currentMatrix === "V") {
      // Check: Are we extending this vertical gap, or was it just opened from M
      alignedA = a[ci - 1] + alignedA;
      alignedB = "-" + alignedB;

      if (ci > 0 && matrixV[ci][cj] === matrixV[ci - 1][cj] + GAP_EXTEND) {
        ci--;
        currentMatrix = "V"; // Stay in Vertical layer (Extend)
      } else {
        ci--;
        currentMatrix = "M"; // Jump back to Match layer (Open/Close transition)
      }
    } else if (currentMatrix === "H") {
      // Check: Are we extending this horizontal gap, or was it just opened from M?
      alignedA = "-" + alignedA;
      alignedB = b[cj - 1] + alignedB;

      if (cj > 0 && matrixH[ci][cj] === matrixH[ci][cj - 1] + GAP_EXTEND) {
        cj--;
        currentMatrix = "H"; // Stay in Horizontal layer (Extend)
      } else {
        cj--;
        currentMatrix = "M"; // Jump back to Match layer (Open/Close transition)
      }
    }
  }

  return { alignedA, alignedB };
}

function calculateStatistics(
  rawScore: number,
  m: number,
  n: number,
  params: GotohParameters,
) {
  // Raw score is simply the sum of all match/mismatch values from the matrix minus the gap penalties
  // The problem it creates is that it is dependent on the scoring matrix used.
  // For example, raw score for same alignment will be higher in PAM250 than in BLOSUM62
  // Because the values used in PAM is generally greater

  const { lambda, k } = params;

  // The bit score is used to normalize the raw score into bits of information
  // It tells how much "information" you had to extract from the sequences to distinguish this alignment from a random one.
  // A Bit Score of n means the alignment is 2n times more likely to be a real biological match than a random coincidence.
  const bitScore = (lambda * rawScore - Math.log(k)) / Math.log(2);

  // E-value is arguably the most important number in bioinformatics. It is a measure of statistical significance.
  // It asks: "In a search space of this size, how many times would I see a score this high just by pure luck?"
  // You want the E-value to be as close to zero as possible.
  const eValue = m * n * Math.pow(2, -bitScore);

  return { bitScore, eValue };
}

export const gotoh = (a: string, b: string, params: GotohParameters) => {
  const { matrixV, matrixH, matrixM, maxCoords, maxScore } = generateMatrix(
    a,
    b,
    params,
  );

  const { alignedA, alignedB } = traceback(
    matrixM,
    matrixH,
    matrixV,
    maxCoords,
    a,
    b,
    params,
  );

  const { eValue, bitScore } = calculateStatistics(
    maxScore,
    a.length,
    b.length,
    params,
  );

  return {
    alignedA,
    alignedB,
    maxScore,
    eValue,
    bitScore,
  };
};
